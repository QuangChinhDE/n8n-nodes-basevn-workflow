import type { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { processResponse } from '../../../../shared/utils';

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
				operation: ['moveBack'],
			},
		},
	},
	{
		displayName: 'Mover Username',
		name: 'mover_username',
		type: 'string',
		required: true,
		default: '',
		description: 'Người thực hiện move back',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['moveBack'],
			},
		},
	},
	{
		displayName: 'Stage ID',
		name: 'stage_id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID của stage cần move về',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['moveBack'],
			},
		},
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', index) as string;
	const mover_username = this.getNodeParameter('mover_username', index) as string;
	const stage_id = this.getNodeParameter('stage_id', index) as string;

	const body = { id, mover_username, stage_id };
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/job/back', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
