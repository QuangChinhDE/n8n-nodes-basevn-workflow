import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { buildRequestBody, processResponse } from '../../../../shared/utils';

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
				operation: ['getAllJobs'],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['getAllJobs'],
			},
		},
		options: [
			{
				displayName: 'Page ID',
				name: 'page_id',
				type: 'string',
				default: '',
				description: 'Trang',
			},
			{
				displayName: 'Stage ID',
				name: 'stage_id',
				type: 'string',
				default: '',
				description: 'Lọc theo stage',
			},
			{
				displayName: 'Search Query',
				name: 'q',
				type: 'string',
				default: '',
				description: 'Tìm theo tên job',
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
				description: 'Lọc theo status',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Số bản ghi',
			},
			{
				displayName: 'Created From',
				name: 'created_from',
				type: 'string',
				default: '',
				description: 'Từ ngày tạo',
			},
			{
				displayName: 'Created To',
				name: 'created_to',
				type: 'string',
				default: '',
				description: 'Đến ngày tạo',
			},
			{
				displayName: 'Deadline From',
				name: 'deadline_from',
				type: 'string',
				default: '',
				description: 'Từ deadline',
			},
			{
				displayName: 'Deadline To',
				name: 'deadline_to',
				type: 'string',
				default: '',
				description: 'Đến deadline',
			},
			{
				displayName: 'Finish From',
				name: 'finish_from',
				type: 'string',
				default: '',
				description: 'Từ ngày hoàn thành',
			},
			{
				displayName: 'Finish To',
				name: 'finish_to',
				type: 'string',
				default: '',
				description: 'Đến ngày hoàn thành',
			},
			{
				displayName: 'Updated From',
				name: 'updated_from',
				type: 'string',
				default: '',
				description: 'Từ ngày cập nhật',
			},
			{
				displayName: 'Updated To',
				name: 'updated_to',
				type: 'string',
				default: '',
				description: 'Đến ngày cập nhật',
			},
			{
				displayName: 'Created By',
				name: 'created_by',
				type: 'string',
				default: '',
				description: 'Username creator',
			},
			{
				displayName: 'Assignee',
				name: 'assignee',
				type: 'string',
				default: '',
				description: 'Username assignee',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const id = this.getNodeParameter('id', index) as string;
	const filters = this.getNodeParameter('filters', index, {}) as IDataObject;

	const body = buildRequestBody({ id, ...filters });
	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/workflow/jobs', body);
	const data = processResponse(response);
	return [{ json: Array.isArray(data) ? data[0] : data }];
}
