import type { IDataObject } from 'n8n-workflow';

export function buildRequestBody(data: IDataObject): IDataObject {
	const body: IDataObject = {};

	Object.keys(data).forEach((key) => {
		if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
			body[key] = data[key];
		}
	});

	return body;
}

export function processResponse(response: any): any {
	if (response && typeof response === 'object' && response.code === 1) {
		return response.data || response;
	}
	return response;
}
