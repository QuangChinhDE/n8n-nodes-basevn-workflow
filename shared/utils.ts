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

export function cleanBody(body: IDataObject): IDataObject {
	const cleaned: IDataObject = {};
	for (const key in body) {
		if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
			cleaned[key] = body[key];
		}
	}
	return cleaned;
}

export function processResponse(response: any, selector: string = ''): any {
	if (!selector) {
		return response;
	}
	
	const paths = selector.split('.');
	let result: any = response;
	
	for (const path of paths) {
		if (result && typeof result === 'object' && path in result) {
			result = result[path];
		} else {
			return response;
		}
	}
	
	return result;
}
