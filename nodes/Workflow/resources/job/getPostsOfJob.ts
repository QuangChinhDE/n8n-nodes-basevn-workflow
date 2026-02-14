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
				operation: ['getPostsOfJob'],
			},
		},
	},
	{
		displayName: 'Last ID',
		name: 'last_id',
		type: 'string',
		default: '',
		description: 'Load post cũ hơn (phân trang comment)',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['getPostsOfJob'],
			},
		},
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', index) as string;
	const last_id = this.getNodeParameter('last_id', index, '') as string;

	const body = buildRequestBody({ id, last_id });
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/job/post/load', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
