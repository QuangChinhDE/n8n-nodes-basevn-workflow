import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class WorkflowApi implements ICredentialType {
	name = 'workflowApi';

	displayName = 'Workflow API';

	documentationUrl = 'https://base.vn';

	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'example.base.vn',
			description: 'Your BaseVN domain',
		},
		{
			displayName: 'Access Token v2',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'BaseVN API access token',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.domain}}/extapi/v1',
			url: '/workflow/list',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: {
				access_token_v2: '={{$credentials.accessToken}}',
			},
		},
	};
}
