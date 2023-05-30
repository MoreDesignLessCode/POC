/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Uuid } from '../../errors/id';
import { Result } from './result';
import { IContext,IStorageProvider } from './storage.interface';
import { GeneralAPIError, ResourceNotFoundError } from '../../errors';
import { Ratings, Constants, Message } from '../../models';
import { formatString } from '../../utils';
import * as Pg from 'pg';
import { IAttachment } from '@procter-gamble/apip-mktpl-das-feedback-types';


export class RatingPgStorageProvider implements IStorageProvider<Ratings> {
    client: Pg.Client;
    columns =
        'id, given_name, middle_name, family_name, created_at, modified_at, deleted_at, created_by, modified_by, deleted_by';

    constructor() {
        const connString = `postgresql://${process.env.FEEDBACK_DAS_DB_USER}:${process.env.FEEDBACK_DAS_DB_PASSWORD}@${process.env.FEEDBACK_DAS_DB_HOST}:${process.env.FEEDBACK_DAS_DB_PORT}/${process.env.FEEDBACK_DAS_DB_NAME}`;

        this.client = new Pg.Client({
            connectionString: connString,
        });
        this.client.connect();
    }
    delete = async (id: Uuid, context: IContext): Promise<Result<Ratings>> => {
        const now = new Date().toISOString();
        try {
            const reponse: any = await this.getRatings(false, false, id);
            const result = reponse.rows.filter(resp => resp.ratingId === id)
            if (result.length >= 1) {
                let attachmentIds = []
                let messageIds = []
                let participantIds = [];
                let artifactId = result[0].id
                if (result[0].attachmentids !== null) {
                    attachmentIds = result[0].attachmentids;
                }
                if (result[0].messageIds !== null) {
                    messageIds = result[0].messageIds;
                }
                let participants = result[0].participants
                if (participants.length > 0) {
                    participants.map((participant) => {
                        participantIds.push(participant.id)
                    });
                }
                const result1 = await this.client.query(
                    'UPDATE feedbackmktpl.attachments SET deleted_at=$1, deleted_by=$2 WHERE id=ANY($3::uuid[])AND deleted_at IS NULL;',
                    [now, Uuid(), attachmentIds]
                );
                const result2 = await this.client.query(
                    'UPDATE feedbackmktpl.messages SET deleted_at=$1, deleted_by=$2 WHERE id=ANY($3::uuid[])AND deleted_at IS NULL;',
                    [now, Uuid(), messageIds]
                );
                const result3 = await this.client.query(
                    'UPDATE feedbackmktpl.participants SET deleted_at=$1, deleted_by=$2 WHERE id=ANY($3::uuid[])AND deleted_at IS NULL;',
                    [now, Uuid(), participantIds]
                );
                const result4 = await this.client.query(
                    `UPDATE feedbackmktpl.artifacts SET deleted_at=$1, deleted_by=$2 WHERE id=$3 AND deleted_at IS NULL;`,
                    [now, Uuid(), artifactId]
                );
                const result5 = await this.client.query(
                    `UPDATE feedbackmktpl.ratings SET deleted_at=$1, deleted_by=$2 WHERE id=$3 AND deleted_at IS NULL;`,
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
                Constants.errors.repository.rating.find.CODE,
                err
            )
                .withTitle(Constants.errors.repository.rating.find.TITLE)
                .withReason(Constants.errors.repository.rating.find.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    }

    findById = async (id: Uuid, context: IContext): Promise<Result<Ratings>> => {
        let includeMessage = false;
        let includeParticipants = false;
        let includeAttachemnts = false;
        const includesParams: [string] = context.get('includes')
        if (includesParams.includes('messages')) {
            includeMessage = true
        }
        if (includesParams.includes('participants')) {
            includeParticipants = true
        }
        try {
            const reponse: any = await this.getRatings(includeMessage, includeParticipants, id);
            if (reponse.rowCount >= 1) {

                const result = reponse.rows.filter(resp => resp.ratingId === id)

                const rating: Ratings = this.buildrating(result[0]);

                return {
                    type: 'ok',
                    data: { type: 'resource', value: rating },
                }
            } else {
                return this.handleResourceNotFound(id);
            }
        }
        catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repository.rating.find.CODE,
                err
            )
                .withTitle(Constants.errors.repository.rating.find.TITLE)
                .withReason(Constants.errors.repository.rating.find.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    }



    getRatings = async (includeMessage: boolean, includeParticipants: boolean, ratingId: Uuid) => {
        let temp = [];
        let query =
            `SELECT t1.id,t1.ref_value as artifactid,t1.created_by as createdby,t1.created_at as createdat,
        (SELECT s.name as status from feedbackmktpl.messages m  join
            feedbackmktpl.status_types s on m.status =s.id where t1.id=m.artifact_id order by m.created_at desc limit 1),
            (select m.summary from feedbackmktpl.messages m where t1.id=m.artifact_id order by m.created_at asc limit 1),
            (select r.id  from feedbackmktpl.ratings r   where t1.id=r.artifact_id)as "ratingId", 
            (select r.rating from feedbackmktpl.ratings r   where t1.id=r.artifact_id),
            (select m.description  from feedbackmktpl.messages m where t1.id=m.artifact_id order by m.created_at asc limit 1),
        (SELECT json_agg(m.id) FROM feedbackmktpl.messages m WHERE m.artifact_id = t1.id) AS "messageIds",
        (SELECT json_agg(json_build_object('id',p.id,'profileId', p.profile_id, 'addedBy', p.added_by,'status', st.name)) 
        FROM feedbackmktpl.participants p 
        LEFT JOIN feedbackmktpl.status_types st ON st.id = p.status
        WHERE p.artifact_id = t1.id) AS participants,
        (SELECT json_agg(a.id) FROM feedbackmktpl.attachments a JOIN feedbackmktpl.messages m ON a.message_id = m.id
         WHERE t1.id = m.artifact_id) AS attachmentIds`;

        if (includeMessage) {
            query += `,(SELECT json_agg( json_build_object('summary', m.summary, 'status', m.status, 'description', m.description, 'id',m.id))
          FROM feedbackmktpl.messages m where t1.id=m.artifact_id) AS messages`;
        }

        query += ` FROM feedbackmktpl.artifacts t1 WHERE t1.ref_type != 'TICKET' `
        if (ratingId !== null) {
            const artifactId = await this.client.query(
                'select artifact_id from feedbackmktpl.ratings where id=$1;', [ratingId]
            )
            const artifactIdValue = await this.client.query(
                'select ref_value from feedbackmktpl.artifacts where id=$1;', [artifactId.rows[0]?.artifact_id]
            )
            temp.push(artifactIdValue?.rows[0]?.ref_value)
            query += `and t1.ref_value=$1 `
        }
        query += `GROUP BY t1.id, t1.ref_value`;
        try {
            const res = await this.client.query(query, temp);
            return res
        }
        catch (err) {
            return err
        }
    };

    all = async (context: IContext): Promise<Result<Ratings>> => {
        let includeMessage = false;
        let includeParticipants = false;
        let includeAttachmennts = false;
        const includesParams: [string] = context.get('includes')
        if (includesParams.includes('messages')) {
            includeMessage = true
        }
        if (includesParams.includes('participants')) {
            includeParticipants = true
        }
        try {
            const reponse: any = await this.getRatings(includeMessage, includeParticipants, null);

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
                Constants.errors.repository.rating.all.CODE,
                err
            )
                .withTitle(Constants.errors.repository.rating.all.TITLE)
                .withReason(Constants.errors.repository.rating.all.MESSAGE);
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

        return response?.rows[0]?.id
    }



    save = async (
        id: Uuid,
        entity: Ratings,
        context: IContext
    ): Promise<Result<Ratings>> => {
        const modifiedBy = Uuid() //get from token
        const returnValue = []
        try {

            const response = await this.client.query(
                ' select t1.artifact_id from feedbackmktpl.ratings t1 where t1.id=$1;',
                [
                    id
                ]

            )
            if (response.rowCount === 0) {
                return this.handleResourceNotFound(id);
            }

            if (entity.rating) {
                const updateRating = await this.client.query(
                    `update  feedbackmktpl.ratings set rating=$1  where artifact_id =$2;`,
                    [entity.rating, response.rows[0].artifact_id]
                )
            }
            const profileIds = await this.client.query(
                `select profile_id from feedbackmktpl.participants p where p.artifact_id =$1;`,
                [response.rows[0].artifact_id]
            )

            let profileIdArray = []
            profileIds?.rows?.map(item => {
                profileIdArray.push(item.profile_id)
            })


            await Promise.all(entity.participants.map(async (participant) => {
                const now = new Date().toISOString();
                let statusId = await this.findStatusValue(participant?.status);
                let participantStatus = await this.findStatusValue(participant.status)
                if (profileIdArray.includes(participant.profileId)) {
                    await this.client.query(
                        `update feedbackmktpl.participants  set modified_at=$4 ,modified_by=$5, status =$1 where artifact_id =$2 and profile_id=$3`,
                        [
                            statusId,
                            response.rows[0].artifact_id,
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
                            response.rows[0].artifact_id,
                            Uuid(),
                            statusId,
                            new Date().toISOString(),
                            Uuid()
                        ]
                    );
                }
            }))

            return {
                type: 'ok',
                data: { type: 'resource', value: entity },
            };
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repository.rating.save.CODE,
                err
            )
                .withTitle(Constants.errors.repository.rating.save.TITLE)
                .withReason(Constants.errors.repository.rating.save.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };


    create = async (
        object: Ratings,
        context: IContext
    ): Promise<Result<any>> => {
        // try {
        const now = new Date().toISOString();
        // const attachmentIds: IAttachment[] = object?.messages?.attachments
        const attachmentIds: IAttachment[] = [];
        let status: any
        let summary: string | undefined
        let description: string | undefined
        if (object?.messages) {
            if (Array.isArray(object.messages)) {
                // If messages is an array of messages, concatenate the attachments from each message
                object.messages.forEach(async (message) => {
                    attachmentIds.push(...(message.attachments || []));
                    status = await this.findStatusValue(message.status)
                    summary = message?.summary;
                    description = message?.description
                });
            } else {
                // If messages is a single message, use its attachments
                attachmentIds.push(...(object.messages.attachments || []));
                status = await this.findStatusValue(object.messages.status)
                summary = object.messages.summary;
                description = object.messages.description
            }
        }

        try {
            let ratingId = Uuid();
            // let ref_value=Uuid()
            let ref_value = object?.artifactIdValue
            let artifactId = Uuid();
            let participantId = Uuid();
            let messageId = Uuid();
            let createdBy = Uuid()//Fetch from token

            let attachmentId = Uuid()
            const { ...rest }: any = object

            const insertArtifact = await this.client.query(
                'INSERT INTO feedbackmktpl.artifacts (id,ref_value,ref_type,created_at,deleted_at,created_by,modified_by,deleted_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);',
                [
                    artifactId,
                    ref_value,
                    "RATING",
                    new Date().toISOString(),
                    null,
                    createdBy,
                    null,
                    null
                ]
            );

            await this.client.query('BEGIN');
            const insertrating = await this.client.query(
                'INSERT INTO feedbackmktpl.ratings (id,artifact_id,rating,created_at,deleted_at,created_by,modified_by,deleted_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);',
                [
                    ratingId,
                    artifactId,
                    rest.rating,
                    new Date().toISOString(),
                    null,
                    Uuid(),
                    createdBy,
                    null
                ]
            )

            object.participants.forEach(async item => {
                let participantId = Uuid();
                //let status = await this.findStatusValue(item.status);
                await this.client.query(
                    'INSERT INTO feedbackmktpl.participants (id,profile_id,artifact_id,added_by,status,created_at,modified_at,deleted_at,created_by,modified_by,deleted_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);',
                    [
                        participantId,
                        Uuid(),
                        artifactId,
                        Uuid(),
                        status,
                        new Date().toISOString(),
                        null,
                        null,
                        createdBy,
                        null,
                        null
                    ]
                );
            })


            const insertMessages = await this.client.query(
                'INSERT INTO feedbackmktpl.messages (id,artifact_id,summary,description,status,created_at,modified_at,deleted_at,created_by,modified_by,deleted_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);',
                [
                    messageId,
                    artifactId,
                    summary,
                    description,
                    status,
                    new Date().toISOString(),
                    null,
                    null,
                    createdBy,
                    null,
                    null
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

            return {
                type: 'ok',
                data: { type: 'resource', value: object },
            };
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repository.rating.create.CODE,
                err
            )
                .withTitle(Constants.errors.repository.rating.create.TITLE)
                .withReason(Constants.errors.repository.rating.create.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    }

    handleResourceNotFound = (id: Uuid): Result<Ratings> => {
        const error = new ResourceNotFoundError(
            Constants.errors.notFound.rating.CODE
        )
            .withTitle(Constants.errors.notFound.rating.TITLE)
            .withReason(
                formatString(Constants.errors.notFound.rating.MESSAGE, id)
            );

        return {
            type: 'error',
            data: error,
        };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buildrating = (element: any): Ratings => {
        console.log(element)
        const rating: Ratings = new Ratings(
            element.ratingId,
            element.rating,
            element.createdby,
            element.status,
            element.summary,
            element.description,
            element.messageIds,
            element.participantIds,
            element.messages,
            element.participants,
            element?.createdat


        );

        return rating;
    };

    handleResult = (res: Pg.QueryResult, type: string): Result<Ratings> => {

        const val: Ratings[] = [];
        res.rows.forEach((element) => {
            const rating: Ratings = this.buildrating(element);
            val.push(rating);
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
