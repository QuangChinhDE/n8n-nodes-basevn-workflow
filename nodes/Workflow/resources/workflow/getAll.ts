import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { buildRequestBody, processResponse } from '../../../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Page ID',
		name: 'page_id',
		type: 'string',
		default: '',
		description: 'Trang (phân trang)',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['getAll'],
			},
		},
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const page_id = this.getNodeParameter('page_id', index, '') as string;

	const body = buildRequestBody({ page_id });
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/workflows/get', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
