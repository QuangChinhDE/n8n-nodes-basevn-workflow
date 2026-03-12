import type { IExecuteFunctions, INodeExecutionData, INodeProperties, IDataObject } from 'n8n-workflow';
import { workflowApiRequest } from '../../../../shared/transport';
import { cleanBody, processResponse } from '../../../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Creator Username',
		name: 'creator_username',
		type: 'string',
		required: true,
		default: '',
		description: 'Người tạo job',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Workflow ID',
		name: 'workflow_id',
		type: 'string',
		required: true,
		default: '',
		description: 'ID của workflow',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		description: 'Tên job',
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
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
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Username (Assignee)',
				name: 'username',
				type: 'string',
				default: '',
				description: 'Assignee username',
			},
			{
				displayName: 'Followers',
				name: 'followers',
				type: 'string',
				default: '',
				description: 'Người theo dõi',
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
	{
		displayName: 'Custom Fields',
		name: 'customFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add Custom Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['create'],
			},
		},
		description: 'Custom fields specific to the workflow',
		options: [
			{
				name: 'fields',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name',
						name: 'name',
						type: 'string',
						default: '',
						placeholder: 'e.g., field1, field2, custom_data',
						description: 'Tên custom field ("workflow_" prefix sẽ tự động thêm vào)',
					},
					{
						displayName: 'Field Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the custom field',
					},
				],
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	
	const creator_username = this.getNodeParameter('creator_username', index) as string;
	const workflow_id = this.getNodeParameter('workflow_id', index) as string;
	const name = this.getNodeParameter('name', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	
	const customFieldsData = this.getNodeParameter('customFields', index, {}) as IDataObject;
	const customFields: IDataObject = {};
	
	if (customFieldsData.fields && Array.isArray(customFieldsData.fields)) {
		for (const field of customFieldsData.fields as Array<{name: string; value: string}>) {
			if (field.name && field.value) {
				const fieldName = field.name.startsWith('workflow_') ? field.name : `workflow_${field.name}`;
				customFields[fieldName] = field.value;
			}
		}
	}

	const body: IDataObject = {
		creator_username,
		workflow_id,
		name,
		...customFields,
	};
	
	if (additionalFields.username) body.username = additionalFields.username;
	if (additionalFields.followers) body.followers = additionalFields.followers;
	if (additionalFields.content) body.content = additionalFields.content;
	if (additionalFields.tags) body.tags = additionalFields.tags;

	const cleanedBody = cleanBody(body);

	const response = await workflowApiRequest.call(this, 'POST', '/extapi/v1/job/create', cleanedBody);
	
	if (response.code === 1) {
		const result = processResponse(response, '');
		returnData.push({
			json: result,
			pairedItem: index,
		});
	} else {
		const errorMsg = response.message || JSON.stringify(response) || 'Unknown error';
		throw new Error(`API Error: ${errorMsg}`);
	}

	return returnData;
}
