/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Uuid,IContext,IStorageProvider, QueryParameters,Result} from '@coe/apip-api-types';
import { GeneralAPIError, ResourceNotFoundError } from '../../errors';
import { Tickets, Constants } from '../../models';
import { formatString } from '../../utils';
import * as Pg from 'pg';

export class TicketPgStorageProvider implements IStorageProvider<Tickets> {
    client: Pg.Client;

    constructor() {
        const connString = `postgresql://${process.env.FEEDBACK_DAS_DB_USER}:${process.env.FEEDBACK_DAS_DB_PASSWORD}@${process.env.FEEDBACK_DAS_DB_HOST}:${process.env.FEEDBACK_DAS_DB_PORT}/${process.env.FEEDBACK_DAS_DB_NAME}`;

        this.client = new Pg.Client({
            connectionString: connString,
        });
        this.client.connect();
    }

    delete = async (id: Uuid, context: IContext): Promise<Result<Tickets>> => {
        const ticketId = [id]
        const now = new Date().toISOString();
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const reponse: any = await this.getTickets(ticketId, context);
            if (reponse.rowCount >= 1) {
                let attachmentIds = []
                let messageIds = []
                const participantIds = [];
                const artifactId = reponse.rows[0].id
                if (reponse.rows[0].attachmentids !== null) {
                    attachmentIds = reponse.rows[0].attachmentids;
                }
                if (reponse.rows[0].messageIds !== null) {
                    messageIds = reponse.rows[0].messageIds;
                }
                const participants=reponse.rows[0].participants
                if (participants.length>0) {
                    participants.map((participant) => {
                        participantIds.push(participant.id)
                    });
                }
                await this.client.query(
                    'UPDATE feedbackmktpl.attachments SET deleted_at=$1, deleted_by=$2 WHERE id=ANY($3::uuid[])AND deleted_at IS NULL;',
                    [now, Uuid(), attachmentIds]
                );
                await this.client.query(
                    'UPDATE feedbackmktpl.messages SET deleted_at=$1, deleted_by=$2 WHERE id=ANY($3::uuid[])AND deleted_at IS NULL;',
                    [now, Uuid(), messageIds]
                );
                await this.client.query(
                    'UPDATE feedbackmktpl.participants SET deleted_at=$1, deleted_by=$2 WHERE id=ANY($3::uuid[])AND deleted_at IS NULL;',
                    [now, Uuid(), participantIds]
                );
                await this.client.query(
                    `UPDATE feedbackmktpl.artifacts SET deleted_at=$1, deleted_by=$2 WHERE id=$3 AND deleted_at IS NULL;`,
                    [now, Uuid(), artifactId]
                );
                await this.client.query(
                    `UPDATE feedbackmktpl.ticket SET deleted_at=$1, deleted_by=$2 WHERE id=$3 AND deleted_at IS NULL;`,
                    [now, Uuid(), id]
                );
                return {
                    type: 'ok',
                    data: { type: 'resource', value: reponse.rows },
                }
            } else {
                return this.handleResourceNotFound(id);
            }
        }
        catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repository.ticket.find.CODE,
                err
            )
                .withTitle(Constants.errors.repository.ticket.find.TITLE)
                .withReason(Constants.errors.repository.ticket.find.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    }
    findById = async (id: Uuid, context: IContext): Promise<Result<Tickets>> => {
        const ticketId = [id]
        try {
            const reponse: any = await this.getTickets(ticketId, context);
            if (reponse.rowCount >= 1) {
                return this.handleResult(reponse, 'collection');
            } else {
                return this.handleResourceNotFound(id);
            }
        }
        catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repository.ticket.find.CODE,
                err
            )
                .withTitle(Constants.errors.repository.ticket.find.TITLE)
                .withReason(Constants.errors.repository.ticket.find.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    }



    getTickets = async (ticketId: Uuid[], context: IContext) => {
        let includeMessage = false;
        let includeAttachments = false;
        const includesParams: [string] = context.get('includes')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pagination: any = context.get('pagination');
        const limit = pagination?.limit;
        const offset = pagination?.offset;
        if (includesParams?.includes('messages')) {
            includeMessage = true
        }
        if (includesParams?.includes('attachments')) {
            includeAttachments = true;
        }

        const temp = [];
        let query = `SELECT t1.id,t1.ref_value AS ticketId,t1.created_by as createdby,
        (SELECT s.name as status from feedbackmktpl.messages m  join
            feedbackmktpl.status_types s on m.status =s.id where t1.id=m.artifact_id order by m.created_at desc limit 1),
            (select m.summary from feedbackmktpl.messages m where t1.id=m.artifact_id order by m.created_at asc limit 1),
            (select m.description  from feedbackmktpl.messages m where t1.id=m.artifact_id order by m.created_at asc limit 1),
        (SELECT json_agg(m.id) FROM feedbackmktpl.messages m WHERE m.artifact_id = t1.id) AS "messageIds",
        (SELECT json_agg(json_build_object('id',p.id,'profileId', p.profile_id, 'addedBy', p.added_by,'status', st.name)) 
        FROM feedbackmktpl.participants p 
        LEFT JOIN feedbackmktpl.status_types st ON st.id = p.status
        WHERE p.artifact_id = t1.id) AS participants,
         (SELECT json_agg(a.id) FROM feedbackmktpl.attachments a JOIN feedbackmktpl.messages m ON a.message_id = m.id
        WHERE t1.id = m.artifact_id) AS attachmentIds`;

        if (includeMessage) {
            query += `,(SELECT json_agg(json_build_object('id', m.id,'description', m.description,'summary', m.summary,
            'status', st.name,'attachmentIds', att.attachments)ORDER BY m.created_at) 
            FROM (select messages.id, messages.summary, messages.status, messages.description, messages.created_at
            FROM feedbackmktpl.messages  WHERE messages.artifact_id = t1.id) m
            LEFT JOIN (SELECT message_id, json_agg(attachments.id) AS attachments FROM feedbackmktpl.attachments 
            GROUP BY message_id) att ON att.message_id = m.id
            LEFT JOIN feedbackmktpl.status_types st ON st.id = m.status) AS messages
            `;
        }
        if (includeAttachments) {
            query += `,(SELECT json_agg(  json_build_object(
                'name', a.name,
                'url', a.path
            )) FROM feedbackmktpl.attachments a JOIN feedbackmktpl.messages m ON a.message_id = m.id
WHERE t1.id = m.artifact_id) AS attachments`
        }

        query += ` FROM feedbackmktpl.artifacts t1 WHERE t1.ref_type = 'TICKET' AND t1.deleted_at IS NULL `
        if (ticketId !== null) {
            temp.push(ticketId)
            query += `and t1.ref_value::uuid = ANY($1::uuid[]) `
        }
        query += `GROUP BY t1.id, t1.ref_value`;
        if (limit && offset) {
            query += ` limit ${limit} offset ${offset}`
        }
        try {
            console.log("tem,p",temp)
            const res = await this.client.query(query, temp);
            return res
        }
        catch (err) {
            return err
        }
    };

    all = async (context: IContext): Promise<Result<Tickets>> => {

        const ids: [Uuid] = context.get('ids')
        const ticketIds = ids?.length > 0 ? ids : null

        try {
            const reponse: any = await this.getTickets(ticketIds, context);
            if (reponse.rowCount >= 1) {
                return this.handleResult(reponse, 'collection');
            } else {
                return {
                    type: 'ok',
                    data: { type: 'collection', value: [] },
                };
            }
        }
        catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repository.ticket.all.CODE,
                err
            )
                .withTitle(Constants.errors.repository.ticket.all.TITLE)
                .withReason(Constants.errors.repository.ticket.all.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    findStatusValue = async (statusType) => {
        const response = await this.client.query(
            ' select st.id from feedbackmktpl.status_types st where st.name=$1;',
            [
                statusType
            ]

        )

        return response.rows[0]
    }

    save = async (
        id: Uuid,
        entity: Tickets,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        context: IContext
    ): Promise<Result<Tickets>> => {
        const modifiedBy = Uuid() //get from token
        try {
            const response = await this.client.query(
                `  select t1.id,t1.ref_value ,   
                (SELECT json_agg(p.profile_id) FROM feedbackmktpl.participants p WHERE p.artifact_id = t1.id) AS "participantIds"
                from feedbackmktpl.artifacts t1  
                where t1.ref_value=$1  GROUP BY t1.id`,
                [
                    id
                ]

            )
            if (response.rowCount === 0) {
                return this.handleResourceNotFound(id);
            }
            await Promise.all(entity.participants.map(async (participant) => {
                const now = new Date().toISOString();
                const participantStatus = await this.findStatusValue(participant.status)
                if (response.rows[0].participantIds.includes(participant.profileId)) {
                    await this.client.query(
                        `update feedbackmktpl.participants  set modified_at=$4 ,modified_by=$5, status =$1 where artifact_id =$2 and profile_id=$3`,
                        [
                            participantStatus.id,
                            response.rows[0].id,
                            participant.profileId,
                            now,
                            Uuid()
                        ]
                    );
                }
                else {
                    await this.client.query(
                        'INSERT INTO feedbackmktpl.participants (id,profile_id,artifact_id,added_by,status,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7);',
                        [
                            Uuid(),
                            participant.profileId,
                            response.rows[0].id,
                            Uuid(),
                            participantStatus.id,
                            new Date().toISOString(),
                            Uuid()
                        ]
                    );
                }
            }))

            const result = await this.client.query(
                ` select * from feedbackmktpl.participants p where p.artifact_id=$1 `,
                [
                    response?.rows[0]?.id
                ]

            )
            return {
                type: 'ok',
                data: { type: 'collection', value: result.rows[0] },
            };

        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repository.ticket.save.CODE,
                err
            )
                .withTitle(Constants.errors.repository.ticket.save.TITLE)
                .withReason(Constants.errors.repository.ticket.save.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };


    create = async (
        object: Tickets,
        context: IContext
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<Result<any>> => {
        // try {
        const attachmentIds = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let status: any
        let summary: string | undefined
        let description: string | undefined
        if (object?.messages) {
            if (Array.isArray(object.messages)) {
                // If messages is an array of messages, concatenate the attachments from each message
                object.messages.forEach(async (message) => {
                    attachmentIds.push(...(message.attachmentIds || []));
                    status = await this.findStatusValue(message.status)
                    summary = message?.summary;
                    description = message?.description
                });
            } else {
                // If messages is a single message, use its attachments
                attachmentIds.push(...(object.messages.attachmentIds || []));
                status = await this.findStatusValue(object.messages.status)
                summary = object.messages.summary;
                description = object.messages.description
            }
        }

        try {
            const ticketId = Uuid();
            const artifactId = Uuid();
            const messageId = Uuid();
            const createdBy = Uuid()//Fetch from token


            await this.client.query('BEGIN');
         await this.client.query(
                'INSERT INTO feedbackmktpl.ticket (id,created_at,created_by) VALUES ($1,$2,$3);',
                [
                    ticketId,
                    new Date().toISOString(),
                    createdBy,
                ]
            )
          await this.client.query(
                'INSERT INTO feedbackmktpl.artifacts (id,ref_value,ref_type,created_at,created_by) VALUES ($1,$2,$3,$4,$5);',
                [
                    artifactId,
                    ticketId,
                    "TICKET",
                    new Date().toISOString(),
                    createdBy,
                ]
            );
            object.participants.forEach(async item => {
                const participantId = Uuid();
                const status = await this.findStatusValue(item.status);
                await this.client.query(
                    'INSERT INTO feedbackmktpl.participants (id,profile_id,artifact_id,added_by,status,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7);',
                    [
                        participantId,
                        Uuid(),
                        artifactId,
                        Uuid(),
                        status.id,
                        new Date().toISOString(),
                        createdBy
                    ]
                );
            })

           await this.client.query(
                'INSERT INTO feedbackmktpl.messages (id,artifact_id,summary,description,status,created_at,created_by) VALUES ($1,$2,$3,$4,$5,$6,$7);',
                [
                    messageId,
                    artifactId,
                    summary,
                    description,
                    status?.id,
                    new Date().toISOString(),
                    createdBy
                ]
            );
            if (attachmentIds) {
                const query = {
                    text: 'UPDATE feedbackmktpl.attachments SET message_id=$1 WHERE id = ANY($2::uuid[])',
                    values: [messageId, attachmentIds],
                };
                await this.client.query(query)
            }
            await this.client.query('COMMIT');

            context.set<QueryParameters>('includes', ['attachments', 'messages'])
            const result = await this.getTickets([ticketId], context)
            return {
                type: 'ok',
                data: { type: 'resource', value: result.rows[0] },
            };
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repository.ticket.create.CODE,
                err
            )
                .withTitle(Constants.errors.repository.ticket.create.TITLE)
                .withReason(Constants.errors.repository.ticket.create.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    }

    handleResourceNotFound = (id: Uuid): Result<Tickets> => {
        const error = new ResourceNotFoundError(
            Constants.errors.notFound.ticket.CODE
        )
            .withTitle(Constants.errors.notFound.ticket.TITLE)
            .withReason(
                formatString(Constants.errors.notFound.ticket.MESSAGE, id)
            );

        return {
            type: 'error',
            data: error,
        };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buildTicket = (element: any): Tickets => {
        const ticket: Tickets = new Tickets(
            element.ticketid,
            element.createdBy,
            element.status,
            element.summary,
            element.description,
            element.messageIds,
            element.participantIds,
            element.attachmentids,
            element.messages,
            element.participants,
            element.attachments


        );
        return ticket;
    };

    handleResult = (res: Pg.QueryResult, type: string): Result<Tickets> => {
        const val: Tickets[] = [];
        res.rows.forEach((element) => {
            const ticket: Tickets = this.buildTicket(element);
            val.push(ticket);
        });

        if (type === 'resource') {
            return {
                type: 'ok',
                data: { type: 'resource', value: val[0] },
            };
        } else {
            return {
                type: 'ok',
                data: { type: 'collection', value: val },
            };
        }
    };
}
