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
				operation: ['moveNext'],
			},
		},
	},
	{
		displayName: 'Mover Username',
		name: 'mover_username',
		type: 'string',
		required: true,
		default: '',
		description: 'Người thực hiện move',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['moveNext'],
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
				operation: ['moveNext'],
			},
		},
		options: [
			{
				displayName: 'Assignee',
				name: 'assignee',
				type: 'string',
				default: '',
				description: 'Assignee (nếu stage yêu cầu)',
			},
			{
				displayName: 'Deadline Date',
				name: 'deadline-date',
				type: 'string',
				default: '',
				placeholder: 'dd/mm/YYYY',
				description: 'Deadline date',
			},
			{
				displayName: 'Deadline Time',
				name: 'deadline-time',
				type: 'string',
				default: '',
				placeholder: 'H:i',
				description: 'Deadline time',
			},
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
	const mover_username = this.getNodeParameter('mover_username', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = buildRequestBody({ id, mover_username, ...additionalFields });
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/job/next', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
