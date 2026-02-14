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
				operation: ['edit'],
			},
		},
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['edit'],
			},
		},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Tên job',
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
	const id = this.getNodeParameter('id', index) as string;
	const updateFields = this.getNodeParameter('updateFields', index, {}) as IDataObject;

	const body = buildRequestBody({ id, ...updateFields });
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/job/edit', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
