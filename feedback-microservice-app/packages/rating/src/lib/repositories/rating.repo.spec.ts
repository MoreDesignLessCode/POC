import {
    parseUuid,
    DefaultRequestContext,
    IContext,
} from '@litmus7/apip-api-types';
import { GeneralAPIError } from '../errors';
import { RatingRepository } from './rating.repo';
import { match } from 'ts-pattern';
import { Ratings, Constants } from '../models';
import { RatingPgStorageProvider } from '../providers';

let testRatingRepository: RatingRepository;
let testRatings: Ratings[];
let testUpdateRatings: Ratings;
let testRating: Ratings;
let testNewRating: Ratings;
let testRequestContext: IContext;

const storageMock = jest.genMockFromModule<RatingPgStorageProvider>(
    '../providers/storage/rating.pg.storage.provider'
);

beforeEach(() => {
    jest.clearAllMocks();

    testRatingRepository = new RatingRepository(storageMock);
    testRatings = [
        {
            id: parseUuid("499430c7-438f-46e6-8bce-2ad5c12061ba"),
            rating: 1,
            status: "NEW",
            summary: "TestMessage123",
            description: "TestMessage123",
            messageIds: [
                parseUuid("5ac0388e-b13c-414d-b0d2-b81e3ce860bb")
            ],
            participantIds: [
                parseUuid( "902406bd-e443-4cb7-935d-239fc8a88957"),
                parseUuid("65e678be-9b08-4bca-ae56-45a26a54673b")
            ],
            messages: [
                {
                    summary: "TestMessage123",
                    status: "NEW",
                    description: "TestMessage123",
                    id:parseUuid( "5ac0388e-b13c-414d-b0d2-b81e3ce860bb")
                }
            ],
            participants: [
                {
                    profile_id: parseUuid("743558c1-e097-4d52-a63d-6c9030fc2c47"),
                    addedBy: parseUuid("5f326205-e259-492c-a76b-67c78b8f865d"),
                    status:"RESPONSIBLE"
                },
                {
                    profile_id:parseUuid("9073cb64-c579-4033-9380-87e1e7753c2f"),
                    addedBy: parseUuid("196af4c2-3f8a-4ffc-b438-a544a7ec9336"),
                    status:"RESPONSIBLE"
                }
            ]
        },
        {
            id: parseUuid("5bf77683-55df-4d4a-9abc-ce8a7061c0bb"),
            rating: 1,
            status: "NEW",
            summary: "TestMessage123",
            description: "TestMessage123",
            messageIds: [
                parseUuid("ef462c2b-fc62-4608-ae91-54e8c7d333e4")
            ],
            participantIds: [
               parseUuid( "587efd4a-3588-4566-b7fe-d65e1dbe8ff2"),
               parseUuid("413b7e13-3c03-4141-ac49-99e07a218bc6")
            ],
            messages: [
                {
                    summary: "TestMessage123",
                    status: 'NEW',
                    description: "TestMessage123",
                    id: parseUuid("ef462c2b-fc62-4608-ae91-54e8c7d333e4")
                }
            ],
            participants: [
                {
                    profile_id:parseUuid("896ce979-8603-4949-bd18-d99486d97aa3"),
                    addedBy: parseUuid("f5c6a5e8-fd61-44b4-a90d-6e9ebdb99abe"),
                    status:"RESPONSIBLE"
                },
                {
                    profile_id: parseUuid("031ea586-9e28-4090-acfa-f455b883463d"),
                    addedBy:parseUuid("cfba4424-2875-41b3-9ce2-94bafb228bf5"),
                    status:"RESPONSIBLE"
                }
            ]
        },
        {
            id: parseUuid("a9efe3fb-f144-447a-aaea-cf9f7082ef55"),
            rating: 4,
            status: "NEW",
            summary: "TestMessage123",
            description: "TestMessage123",
            messageIds: [
                parseUuid("1c4895a5-6b8c-4a63-b896-d55191905743")
            ],
            participantIds: [
               parseUuid( "ba4f2c9c-bd9e-4679-b83a-7b514bfcf821"),
               parseUuid("411f0364-213b-42f5-a0ec-d5025fee3b55")
            ],
            messages: [
                {
                    summary: "TestMessage123",
                    status: 'NEW',
                    description: "TestMessage123",
                    id: parseUuid("1c4895a5-6b8c-4a63-b896-d55191905743")
                }
            ],
            participants: [
                {
                    profile_id:parseUuid("02f890cb-1fe9-4b26-bf2e-46ce2771871d"),
                    addedBy: parseUuid("88fd4a9a-98d8-41f4-898f-2ba0d8bcf5be"),
                    status:"RESPONSIBLE"
                },
                {
                    profile_id: parseUuid("a97ed717-ea2a-43be-a816-b44ac865a8da"),
                    addedBy:parseUuid("b3bc290e-6187-4c42-943f-368e7f7317c6"),
                    status:"RESPONSIBLE"
                }
            ]
        }
    ];
    testUpdateRatings =    {
        id: parseUuid("a9efe3fb-f144-447a-aaea-cf9f7082ef55"),
        rating: 3,
        status: "NEW",
        summary: "TestMessage123",
        description: "TestMessage123",
        messageIds: [
            parseUuid("1c4895a5-6b8c-4a63-b896-d55191905743")
        ],
        participantIds: [
           parseUuid( "ba4f2c9c-bd9e-4679-b83a-7b514bfcf821"),
           parseUuid("411f0364-213b-42f5-a0ec-d5025fee3b55")
        ],
        messages: [
            {
                summary: "TestMessage123",
                status: 'NEW',
                description: "TestMessage123",
                id: parseUuid("1c4895a5-6b8c-4a63-b896-d55191905743")
            }
        ],
        participants: [
            {
                profile_id:parseUuid("02f890cb-1fe9-4b26-bf2e-46ce2771871d"),
                addedBy: parseUuid("88fd4a9a-98d8-41f4-898f-2ba0d8bcf5be"),
                status:"CONSULTING"
            },
            {
                profile_id: parseUuid("a97ed717-ea2a-43be-a816-b44ac865a8da"),
                addedBy:parseUuid("b3bc290e-6187-4c42-943f-368e7f7317c6"),
                status:"RESPONSIBLE"
            }
        ]
    };
    testRating =  {
        id:parseUuid("ffef46f2-87aa-40fd-b89e-019067de074a"),
        rating: 1,
        status: "NEW",
        summary: "RatingSummary",
        description: "Rating Description",
        messageIds: [
           parseUuid("107840ba-5c7f-40f7-b3da-086ca9168296")
        ],
        participantIds: [
           parseUuid("3ecd9174-7b28-4a60-a93d-0596a9daea17"),
           parseUuid("842f1f51-8358-4d9c-847e-42865d698661")
        ],
        messages: [
            {
                summary: "RatingSummary",
                status: "NEW",
                description: "Rating Description",
                id: parseUuid("107840ba-5c7f-40f7-b3da-086ca9168296")
            }
        ],
        participants: [
            {
                profile_id: parseUuid("46bb6076-5416-43b7-a6e5-d4126866f502"),
                addedBy: parseUuid("c09b75f3-cadb-4bb6-ab95-4f85092b08a5"),
                status:"RESPONSIBLE"
            }
        ]
    };
    testNewRating = {
        id: parseUuid("423eb227-65e3-44b9-befc-2354582953cc"),
        rating: 2,
        status: "NEW",
        summary: "TestMessage123",
        description: "TestMessage123",
        messageIds: [
            parseUuid("b890bbc6-3e6d-4c94-ad72-128589216f3b")
        ],
        participantIds: [
            parseUuid("647ba8d5-9026-4760-a220-2216a3efab18"),
            parseUuid("9f7d4390-46d5-4db5-b9ba-4af87e1717ed")
        ],
        messages: [
            {
                summary: "TestMessage123",
                status: "NEW",
                description: "TestMessage123",
                id: parseUuid("b890bbc6-3e6d-4c94-ad72-128589216f3b")
            }
        ],
        participants: [
            {
                profile_id: parseUuid("9e54b9f5-c89b-417d-9359-4be41105a12d"),
                addedBy:parseUuid("bd5074f9-f268-48b5-96a2-c5858fa27570"),
                status:"RESPONSIBLE"
            }
        ]
    }
});

describe('all function test', () => {
    it('the all function should return all ratings in the repo', async () => {
        storageMock.all = jest.fn().mockResolvedValue({
            type: 'ok',
            data: { type: 'collection', value: testRatings },
        });
        const result = await testRatingRepository.all(
            new DefaultRequestContext()
        );
        match(result)
            .with({ type: 'ok' }, (res) => {
                expect(res.data.value).toStrictEqual(testRatings);
            })
            .with({ type: 'error' }, () => expect(false).toBe(true))
            .exhaustive();
    });
});

describe('find function test', () => {
    it('the find function should return a rating with the associated ID', async () => {
        storageMock.findById = jest.fn().mockResolvedValue({
            type: 'ok',
            data: { type: 'resource', value: testRating },
        });
        const result = await testRatingRepository.find(
            parseUuid('499430c7-438f-46e6-8bce-2ad5c12061ba'),
            new DefaultRequestContext()
        );

        match(result)
            .with({ type: 'ok' }, (res) => {
                expect(res.data.value).toStrictEqual(testRating);
            })
            .with({ type: 'error' }, () => expect(false).toBe(true))
            .exhaustive();
    });
});

describe('create function test', () => {
    it('create should add a rating object to the repo', async () => {
        storageMock.create = jest.fn(() => {
            return new Promise((resolve) => {
                testRatings.push(testNewRating);
                resolve({
                    type: 'ok',
                    data: { type: 'resource', value: testNewRating },
                });
            });
        });
        storageMock.all = jest.fn().mockResolvedValue({
            type: 'ok',
            data: { type: 'resourceCollection', value: testRatings },
        });

        const repoSize = testRatings.length;
        await testRatingRepository.create(
            testNewRating,
            new DefaultRequestContext()
        );

        const result = await testRatingRepository.all(
            new DefaultRequestContext()
        );
        match(result).with(
            { type: 'ok', data: { type: 'collection' } },
            (res) => {
                testRatings = res.data.value;
                let newRepoSize = testRatings.length;
                newRepoSize--;
                expect(newRepoSize).toBe(repoSize);
            }
        );
    });
});

describe('update function test', () => {
    it('saving a rating object should return an updated rating', async () => {
        storageMock.save = jest.fn().mockResolvedValue({
            type: 'ok',
            data: { type: 'resource', value: testUpdateRatings },
        });
        const result = await testRatingRepository.update(
            parseUuid('a9efe3fb-f144-447a-aaea-cf9f7082ef55'),
            testUpdateRatings,
            testRequestContext
        );

        match(result)
            .with({ type: 'ok' }, (res) => {
                expect(res.data.value).toBe(testUpdateRatings);
            })
            .with({ type: 'error' }, () => expect(false).toBe(true))
            .exhaustive();
    });
});

describe('delete function test', () => {
    it('deleting a rating by id should remove rating at found index', async () => {
        storageMock.delete = jest.fn((id: string) => {
            return new Promise((resolve) => {
                const result = testRatings.find((rating: Ratings) => {
                    return rating.id === id;
                });
                if (result != undefined) {
                    const index = testRatings.indexOf(result, 0);
                    if (index > -1) {
                        testRatings.splice(index, 1);
                        resolve({
                            type: 'ok',
                            data: { type: 'resource', value: result },
                        });
                    } else {
                        const error = new GeneralAPIError(
                            Constants.errors.generalError.CODE
                        );
                        resolve({
                            type: 'error',
                            data: error,
                        });
                    }
                } else {
                    const error = new GeneralAPIError(
                        Constants.errors.generalError.CODE
                    );
                    resolve({
                        type: 'error',
                        data: error,
                    });
                }
            });
        });
        await testRatingRepository.delete(
            parseUuid('499430c7-438f-46e6-8bce-2ad5c12061ba'),
            testRequestContext
        );

        const result = await testRatingRepository.delete(
            parseUuid('499430c7-438f-46e6-8bce-2ad5c12061ba'),
            testRequestContext
        );

        match(result)
            .with({ type: 'error' }, (res) => {
                expect(res.data).toBeInstanceOf(GeneralAPIError);
            })
            .with({ type: 'ok' }, () => expect(false).toBe(true))
            .exhaustive();
    });
});

describe('test undefined storageProvider', () => {
    it('should throw StorageProviderUndefinedException when storage provider not defined', () => {
        let thrownError;

        try {
            testRatingRepository = new RatingRepository(undefined);
        } catch (error) {
            thrownError = error;
        }

        expect(thrownError).toHaveProperty(
            'reason',
            Constants.errors.repository.rating.storageProvider.undefined.MESSAGE
        );
        expect(thrownError).toHaveProperty(
            'code',
            Constants.errors.repository.rating.storageProvider.undefined.CODE
        );
        expect(thrownError).toHaveProperty('instance');
        expect(thrownError).toHaveProperty('pointer', '');
        expect(thrownError).toHaveProperty(
            'title',
            Constants.errors.repository.rating.storageProvider.undefined.TITLE
        );
    });
});
