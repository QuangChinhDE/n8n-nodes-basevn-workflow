import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { buildRequestBody, processResponse } from '../../../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Post ID',
		name: 'hid',
		type: 'string',
		required: true,
		default: '',
		description: 'ID của post trong job',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['getCommentsOfJob'],
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
				operation: ['getCommentsOfJob'],
			},
		},
		options: [
			{
				displayName: 'Method',
				name: 'method',
				type: 'options',
				default: 'page',
				options: [
					{ name: 'Page', value: 'page' },
					{ name: 'Previous', value: 'prev' },
				],
				description: 'Load method',
			},
			{
				displayName: 'Position',
				name: 'position',
				type: 'string',
				default: '',
				description: 'Position value (depends on method)',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const hid = this.getNodeParameter('hid', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = buildRequestBody({ hid, ...additionalFields });
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/job/comment/load', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
