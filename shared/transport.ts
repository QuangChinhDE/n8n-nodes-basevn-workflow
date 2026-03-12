import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { IHttpRequestMethods } from 'n8n-workflow';

export async function workflowApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('workflowApi');
	const domain = credentials.domain as string;
	const accessToken = credentials.accessToken as string;

	const requestBody = {
		access_token_v2: accessToken,
		...body,
	};

	const options = {
		method,
		body: requestBody,
		url: `https://${domain}${endpoint}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	};

	return await this.helpers.httpRequest(options);
}
