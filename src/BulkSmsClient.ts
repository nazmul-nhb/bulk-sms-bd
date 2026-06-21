import {
	isArrayOfType,
	isEmptyObject,
	isError,
	isNonEmptyString,
	isObjectWithKeys,
	isString,
	isValidArray,
} from 'toolbox-x/guards';
import { BulkSmsError } from './BulkSmsError';
import type { BulkSmsBdConfig, BulkSmsResponse, Message, SmsBody } from './types';

export class BulkSmsClient {
	readonly #bulkSmsBaseApi: string;
	readonly #bulkSmsApiKey: string;
	readonly #bulkSmsSenderId: string;

	constructor(configs: BulkSmsBdConfig) {
		if (isEmptyObject(configs)) {
			throw new BulkSmsError(
				'Configuration is empty for Bulk SMS BD! Please provide a valid configuration!'
			);
		}

		if (
			isObjectWithKeys(configs, ['bulkSmsApiKey', 'bulkSmsSenderId']) &&
			isNonEmptyString(configs.bulkSmsApiKey) &&
			isNonEmptyString(configs.bulkSmsSenderId)
		) {
			this.#bulkSmsBaseApi = isNonEmptyString(configs.bulkSmsBaseApi)
				? configs.bulkSmsBaseApi
				: 'https://bulksmsbd.net/api';

			this.#bulkSmsApiKey = configs.bulkSmsApiKey;
			this.#bulkSmsSenderId = configs.bulkSmsSenderId;
		}

		throw new BulkSmsError(
			'Configuration is incomplete for Bulk SMS BD! Please provide bulkSmsApiKey and bulkSmsSenderId!'
		);
	}

	/**
	 * * Send multiple SMS to different numbers
	 * @param messages - Array of messages
	 */
	sendSMS(messages: Message[]): Promise<void>;

	/**
	 * * Send same SMS to multiple numbers
	 * @param to - Array of numbers
	 * @param message - Message to send
	 */
	sendSMS(to: string[], message: string): Promise<void>;

	/**
	 * * Send single SMS to a number
	 * @param to - Number to send SMS to
	 * @param message - Message to send
	 */
	sendSMS(to: string, message: string): Promise<void>;

	async sendSMS(toOrMessages: string | string[] | Message[], msg?: string): Promise<void> {
		try {
			let smsApi = this.#bulkSmsBaseApi;

			const smsBody = {
				api_key: this.#bulkSmsApiKey,
				senderid: this.#bulkSmsSenderId,
			} as SmsBody;

			if (isValidArray(toOrMessages)) {
				if (isArrayOfType(toOrMessages, isString)) {
					smsApi = `${smsApi}/smsapimany`;
					smsBody.number = toOrMessages.join(',');
					smsBody.message = String(msg);
				} else {
					smsApi = `${smsApi}/smsapi`;
					smsBody.messages = toOrMessages;
				}
			} else if (isNonEmptyString(msg)) {
				smsApi = `${smsApi}/smsapi`;
				smsBody.number = toOrMessages;
				smsBody.message = msg;
			}

			const res = await fetch(smsApi, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(smsBody),
			});

			const data: BulkSmsResponse = await res.json();

			if (!data.success_message) {
				throw new BulkSmsError(data.error_message);
			}
		} catch (error) {
			throw new BulkSmsError(isError(error) ? error.message : 'Failed to send SMS');
		}
	}
}
