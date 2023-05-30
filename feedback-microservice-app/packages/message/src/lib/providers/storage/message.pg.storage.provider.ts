/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { Uuid } from '../../errors/id';
import { Result } from './result';
import { IContext,IStorageProvider } from './storage.interface';
import { GeneralAPIError, ResourceNotFoundError } from '../../errors';
import { Messages, Constants } from '../../models';
import { formatString } from '../../utils';
import * as Pg from 'pg';
import { validate } from 'uuid';

export class MessagePgStorageProvider implements IStorageProvider<Messages> {
    client: Pg.Client;
    columns =
        'id, artifact_id, summary, description,status, created_at, modified_at, deleted_at, created_by, modified_by, deleted_by';

    constructor() {
        const connString = `postgresql://${process.env.FEEDBACK_DAS_DB_USER}:${process.env.FEEDBACK_DAS_DB_PASSWORD}@${process.env.FEEDBACK_DAS_DB_HOST}:${process.env.FEEDBACK_DAS_DB_PORT}/${process.env.FEEDBACK_DAS_DB_NAME}`;

        this.client = new Pg.Client({
            connectionString: connString,
        });
        this.client.connect();
    }
    findStatusValue = async (statusType) => {
        const response = await this.client.query(
            'select st.id from feedbackmktpl.status_types st where st.name=$1;',
            [
                statusType
            ]

        )
        return response.rows[0].id
    }

    create = async (
        messages: Messages,
        context: IContext
    ): Promise<Result<any>> => {
        let messageIds=[];
        try {
         await Promise.all(messages.map(async (message)=>{
            const artifactidvlaue=message?.artifactIdValue
            const artifactType=message?.artifactType
            let messageId=Uuid()
            messageIds.push(messageId)
            let attachmentIds=message.attachments
            const status = await this.findStatusValue(message?.status)
            let artifactId:any
            if(artifactType==='RATING'){
                artifactId= await this.client.query(
                    'SELECT artifact_id as id FROM feedbackmktpl.ratings WHERE id=$1',[artifactidvlaue]
                   )
            }
            else{
            artifactId= await this.client.query(
             'SELECT id FROM feedbackmktpl.artifacts WHERE ref_value=$1 and ref_type=$2',[artifactidvlaue,artifactType]
            )
            }
            console.log("artifact",artifactId)
             const insertMessages = await this.client.query(
                 'INSERT INTO feedbackmktpl.messages (id,artifact_id,summary,description,status,created_at,modified_at,deleted_at,created_by,modified_by,deleted_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);',
             [
                 messageId,
                 artifactId.rows[0].id,
                 message.summary,
                 message.description,
                 status,
                 new Date().toISOString(),
                 null,
                 null,
                 Uuid(),
                 null,
                 null,
             ]
         );
         const query = {
             text:'UPDATE feedbackmktpl.attachments SET message_id=$1 WHERE id = ANY($2::uuid[])',
             values: [messageId,attachmentIds],
           };
           await this.client.query(query)
           }))
          
        const response = await this.client.query(
            `select m.id  ,m.summary ,m.description,m.created_by,s.name as status,
             (SELECT json_agg(a.id) FROM feedbackmktpl.attachments a  WHERE a.message_id  = m.id) as attachmentIds 
             FROM feedbackmktpl.messages m join feedbackmktpl.status_types s on m.status =s.id 
             WHERE m.id = ANY($1::uuid[])`,[messageIds]
        )
    return {
        type: 'ok',
          data: { type: 'resource', value: response.rows[0]},
      };
     } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.message.create.CODE,
                err
            )
                .withTitle(Constants.errors.repo.message.create.TITLE)
                .withReason(Constants.errors.repo.message.create.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };
    
    save = async (
        id: Uuid,
        entity: Messages,
        context: IContext
    ): Promise<Result<Messages>> => {
        try {
            const id_value=id
            const now = new Date().toISOString();
            const attachments=entity.attachments
            const status_value =entity.status
            const status=await this.client.query(
                'SELECT id from feedbackmktpl.status_types WHERE name=$1',[status_value]
            );
            const result = await this.client.query(
                'UPDATE feedbackmktpl.messages SET summary=$1, description=$2, status=$3, modified_at=$4, modified_by=$5 WHERE id=$6;',
                [
                    entity.summary,
                    entity.description,
                    status.rows[0].id,
                    now,
                    Uuid(),
                    id_value,
                ]
            );
            const query = {
                text:'UPDATE feedbackmktpl.attachments SET message_id=$1 WHERE id = ANY($2::uuid[])',
                values: [id,attachments],
              };
              await this.client.query(query)
            if (result.rowCount === 0) {
                return this.handleResourceNotFound(id);
            }

            const selectResult = await this.client.query(
               'select m.id  ,m.summary ,m.description,m.created_by,s.name as status, (SELECT json_agg(a.id) FROM feedbackmktpl.attachments a  WHERE a.message_id  = m.id) as attachmentIds FROM feedbackmktpl.messages m join feedbackmktpl.status_types s on m.status =s.id WHERE m.id=$1',
                [id_value]
            );

            if (selectResult.rowCount >= 1) {
                return this.handleResult(selectResult, 'resource');
            } else {
                return this.handleResourceNotFound(id);
            }
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.message.save.CODE,
                err
            )
                .withTitle(Constants.errors.repo.message.save.TITLE)
                .withReason(Constants.errors.repo.message.save.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    delete = async (id: Uuid, context: IContext): Promise<Result<Messages>> => {
        try {
            const now = new Date().toISOString();
            const result1 = await this.client.query(
                'UPDATE feedbackmktpl.messages SET deleted_at=$1, deleted_by=$2 WHERE id=$3;',
                [now,Uuid(),id]
            );
                 await this.client.query(
                'UPDATE feedbackmktpl.attachments SET deleted_at=$1, deleted_by=$2 WHERE message_id=$3;',
                [now,Uuid(),id]
            );
            if (result1.rowCount >= 1) {
                try {
                    const result = await this.client.query(
                        `SELECT ${this.columns} FROM feedbackmktpl.messages WHERE id=$1`,
                        [id]
                    );
                    if (result.rowCount >= 1) {
                        return this.handleResult(result, 'resource');
                    } else {
                        return this.handleResourceNotFound(id);
                    }
                } catch (err) {
                    const error = new GeneralAPIError(
                        Constants.errors.repo.message.innerDelete.CODE,
                        err
                    )
                        .withTitle(
                            Constants.errors.repo.message.innerDelete.TITLE
                        )
                        .withReason(
                            Constants.errors.repo.message.innerDelete.MESSAGE
                        );
                    return {
                        type: 'error',
                        data: error,
                    };
                }
            } else {
                return this.handleResourceNotFound(id);
            }
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.message.delete.CODE,
                err
            )
                .withTitle(Constants.errors.repo.message.delete.TITLE)
                .withReason(Constants.errors.repo.message.delete.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    all = async (_context: IContext): Promise<Result<Messages>> => {
        try {

            const requestType: [string] = _context.get('artifactType')
            const messageIds: [Uuid] = _context.get('id')
            const refType= _context.get('refType')
            const refValue= _context.get('refValue')
            let res: any = {}
            if (requestType) {
                const resultArray = await this.client.query(
                    'select id from feedbackmktpl.artifacts where ref_type=$1 and ref_value=$2', [refType,refValue]
                )
                const arIdArray = []
                resultArray.rows.map((object: any) => {
                    arIdArray.push(object.id)
                })
                const query = {
                    text: 'select m.id as messageId ,m.summary ,m.description,s.name as status, (SELECT json_agg(a.id) FROM feedbackmktpl.attachments a  WHERE a.message_id  = m.id) as attachmentIds FROM feedbackmktpl.messages m join feedbackmktpl.status_types s on m.status =s.id WHERE m.artifact_id = ANY($1::uuid[]) AND m.deleted_at IS null ',
                    values: [arIdArray]

                }
                res = await this.client.query(query)
            }
            else if(messageIds.length>0) {
                const query = {
                    text: 'select m.id as messageId ,m.summary ,m.description,s.name as status, (SELECT json_agg(a.id) FROM feedbackmktpl.attachments a  WHERE a.message_id  = m.id) as attachmentIds FROM feedbackmktpl.messages m join feedbackmktpl.status_types s on m.status =s.id WHERE m.id = ANY($1::uuid[]) AND m.deleted_at IS null',
                    values: [messageIds],
                };
                res = await this.client.query(query)
            }
            else{
                const query = {
                    text: 'select m.id as messageId ,m.summary ,m.description,s.name as status, (SELECT json_agg(a.id) FROM feedbackmktpl.attachments a  WHERE a.message_id  = m.id) as attachmentIds FROM feedbackmktpl.messages m join feedbackmktpl.status_types s on m.status =s.id WHERE m.deleted_at IS null',
                };
                res = await this.client.query(query)
            }

            if (res.rowCount >= 1) {
                return this.handleResult(res, 'collection');
            } else {
                return this.handleResourceNotFound(null);
            }
        } catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.message.all.CODE,
                err
            )
                .withTitle(Constants.errors.repo.message.all.TITLE)
                .withReason(Constants.errors.repo.message.all.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };

    findById = async (
        id: Uuid,
        _context: IContext
    ): Promise<Result<Messages>> => {
        try {
            let res: any = {}
                const query = {
                    text: 'select m.id as messageId ,m.summary ,m.description,s.name as status, (SELECT json_agg(a.id) FROM feedbackmktpl.attachments a  WHERE a.message_id  = m.id) as attachmentIds FROM feedbackmktpl.messages m join feedbackmktpl.status_types s on m.status =s.id WHERE m.id = $1',
                    values: [id],
                };
                res = await this.client.query(query)
             if(res.rowCount>=1){
            return {
                type: 'ok',
                data: { type: 'resource', value: res.rows },
            };}
            else{
                return this.handleResourceNotFound(id)
            }
        }
        catch (err) {
            const error = new GeneralAPIError(
                Constants.errors.repo.message.find.CODE,
                err
            )
                .withTitle(Constants.errors.repo.message.find.TITLE)
                .withReason(Constants.errors.repo.message.find.MESSAGE);
            return {
                type: 'error',
                data: error,
            };
        }
    };


   
    handleResourceNotFound = (id: Uuid): Result<Messages> => {
        const error = new ResourceNotFoundError(
            Constants.errors.notFound.message.CODE
        )
            .withTitle(Constants.errors.notFound.message.TITLE)
            .withReason(
                formatString(Constants.errors.notFound.message.MESSAGE, id)
            );

        return {
            type: 'error',
            data: error,
        };
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    buildMessage = (element: any): Messages => {
        const message: Messages = new Messages(
             element.id,
             element.summary,
             element.description,
             element.status, 
             element.created_by,
             element.attachmentids

            // new Name(
            //     element.given_name,
            //     element.family_name,
            //     element.middle_name
            // )
        );

        return message;
    };

    handleResult = (res: Pg.QueryResult, type: string): Result<Messages> => {
      
        const val: Messages[] = [];
        res.rows.forEach((element) => {
            const message: Messages = this.buildMessage(element);
            val.push(message);
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

