import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { buildRequestBody, processResponse } from '../../../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Creator Username',
		name: 'creator_username',
		type: 'string',
		required: true,
		default: '',
		description: 'Người tạo job',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Workflow ID',
		name: 'workflow_id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID của workflow',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Tên job',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Username (Assignee)',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Assignee username',
			},
			{
				displayName: 'Followers',
				name: 'followers',
				type: 'string',
				default: '',
				description: 'Người theo dõi',
			},
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				default: '',
				typeOptions: { rows: 4 },
				description: 'Nội dung job',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Tags',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const creator_username = this.getNodeParameter('creator_username', index) as string;
	const workflow_id = this.getNodeParameter('workflow_id', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = buildRequestBody({
		creator_username,
		workflow_id,
		name,
		...additionalFields,
	});

	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/job/create', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
