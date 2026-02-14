import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { buildRequestBody, processResponse } from '../../../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['getAll'],
			},
		},
		options: [
			{
				displayName: 'Page ID',
				name: 'page_id',
				type: 'string',
				default: '',
				description: 'Page ID for pagination',
			},
			{
				displayName: 'Workflow ID',
				name: 'workflow_id',
				type: 'string',
				default: '',
				description: 'Filter by workflow ID',
			},
			{
				displayName: 'Username (Assignee)',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Filter by assignee username',
			},
			{
				displayName: 'Creator Username',
				name: 'creator_username',
				type: 'string',
				default: '',
				description: 'Filter by creator username',
			},
			{
				displayName: 'Search Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Search by job name',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				default: '',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Done', value: 'done' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Overdue', value: 'overdue' },
				],
				description: 'Filter by status',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Number of results to return',
			},
			{
				displayName: 'Created From',
				name: 'created_from',
				type: 'string',
				default: '',
				description: 'Created from timestamp',
			},
			{
				displayName: 'Created To',
				name: 'created_to',
				type: 'string',
				default: '',
				description: 'Created to timestamp',
			},
			{
				displayName: 'Deadline From',
				name: 'deadline_from',
				type: 'string',
				default: '',
				description: 'Deadline from timestamp',
			},
			{
				displayName: 'Deadline To',
				name: 'deadline_to',
				type: 'string',
				default: '',
				description: 'Deadline to timestamp',
			},
			{
				displayName: 'Updated From',
				name: 'updated_from',
				type: 'string',
				default: '',
				description: 'Updated from timestamp',
			},
			{
				displayName: 'Updated To',
				name: 'updated_to',
				type: 'string',
				default: '',
				description: 'Updated to timestamp',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

	const body = buildRequestBody(filters);
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/jobs/get', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
