import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { job, workflow } from './resources';

export class Workflow implements INodeType {
	usableAsTool = true;

	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Workflow',
		name: 'workflow',
		icon: 'file:../../icons/workflow.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with BaseVN Workflow API',
		defaults: {
			name: 'BaseVN Workflow',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'workflowApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.domain}}',
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Job',
						value: 'job',
					},
					{
						name: 'Workflow',
						value: 'workflow',
					},
				],
				default: 'job',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['job'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create a new job',
						action: 'Create a job',
					},
					{
						name: 'Edit',
						value: 'edit',
						description: 'Edit a job',
						action: 'Edit a job',
					},
					{
						name: 'Get',
						value: 'get',
						description: 'Get a job',
						action: 'Get a job',
					},
					{
						name: 'Get Comments',
						value: 'getCommentsOfJob',
						description: 'Get comments of job',
						action: 'Get comments of job',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many jobs',
						action: 'Get many jobs',
					},
					{
						name: 'Get Posts',
						value: 'getPostsOfJob',
						description: 'Get posts of job',
						action: 'Get posts of job',
					},
					{
						name: 'Get with Custom Table',
						value: 'getWithCustomTable',
						description: 'Get job with custom field table',
						action: 'Get job with custom table',
					},
					{
						name: 'Mark Failed',
						value: 'markFailed',
						description: 'Mark job as failed',
						action: 'Mark job as failed',
					},
					{
						name: 'Move Back',
						value: 'moveBack',
						description: 'Move job to previous stage',
						action: 'Move job back',
					},
					{
						name: 'Move Next',
						value: 'moveNext',
						description: 'Move job to next stage',
						action: 'Move job next',
					},
				],
				default: 'getAll',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['workflow'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						description: 'Get a workflow',
						action: 'Get a workflow',
					},
					{
						name: 'Get All Jobs',
						value: 'getAllJobs',
						description: 'Get all jobs in a workflow',
						action: 'Get all jobs in workflow',
					},
					{
						name: 'Get All Stages',
						value: 'getAllStages',
						description: 'Get all stages in a workflow',
						action: 'Get all stages in workflow',
					},
					{
						name: 'Get Many',
						value: 'getAll',
						description: 'Get many workflows',
						action: 'Get many workflows',
					},
				],
				default: 'getAll',
			},
			...job.getPostsOfJob.description,
			...job.getCommentsOfJob.description,
			...job.get.description,
			...job.getWithCustomTable.description,
			...job.create.description,
			...job.edit.description,
			...job.moveNext.description,
			...job.moveBack.description,
			...job.markFailed.description,
			...job.getAll.description,
			...workflow.get.description,
			...workflow.getAllJobs.description,
			...workflow.getAllStages.description,
			...workflow.getAll.description,
		],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'job') {
					if (operation === 'getPostsOfJob') {
						const result = await job.getPostsOfJob.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'getCommentsOfJob') {
						const result = await job.getCommentsOfJob.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'get') {
						const result = await job.get.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'getWithCustomTable') {
						const result = await job.getWithCustomTable.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'create') {
						const result = await job.create.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'edit') {
						const result = await job.edit.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'moveNext') {
						const result = await job.moveNext.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'moveBack') {
						const result = await job.moveBack.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'markFailed') {
						const result = await job.markFailed.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'getAll') {
						const result = await job.getAll.execute.call(this, i);
						returnData.push(...result);
					}
				} else if (resource === 'workflow') {
					if (operation === 'get') {
						const result = await workflow.get.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'getAllJobs') {
						const result = await workflow.getAllJobs.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'getAllStages') {
						const result = await workflow.getAllStages.execute.call(this, i);
						returnData.push(...result);
					} else if (operation === 'getAll') {
						const result = await workflow.getAll.execute.call(this, i);
						returnData.push(...result);
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({ json: { error: errorMessage } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
