import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { buildRequestBody, processResponse } from '../../../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Job ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID của job',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['markFailed'],
			},
		},
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		required: true,
		default: '',
		description: 'Người đánh dấu failed',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['markFailed'],
			},
		},
	},
	{
		displayName: 'Failed Reason ID',
		name: 'failed_reason_id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID của failed reason',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['markFailed'],
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
				operation: ['markFailed'],
			},
		},
		options: [
			{
				displayName: 'Note',
				name: 'note',
				type: 'string',
				default: '',
				typeOptions: { rows: 3 },
				description: 'Note',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', index) as string;
	const username = this.getNodeParameter('username', index) as string;
	const failed_reason_id = this.getNodeParameter('failed_reason_id', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = buildRequestBody({ id, username, failed_reason_id, ...additionalFields });
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/job/fail', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
