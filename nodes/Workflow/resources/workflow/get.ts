import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { processResponse } from '../../../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Workflow ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID của workflow',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['get'],
			},
		},
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', index) as string;

	const body = { id };
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/workflow/get', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
