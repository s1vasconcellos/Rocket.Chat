import { Meteor } from 'meteor/meteor';
import twilio from 'twilio';
import { Random } from 'meteor/random';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';
import filesize from 'filesize';

import { settings } from '../../../settings';
import { SMS } from '../SMS';
import { Notifications } from '../../../notifications';
import { fileUploadIsValidContentType } from '../../../utils/lib/fileUploadRestrictions';

const MAX_FILE_SIZE = 5242880;

const notifyAgent = (userId, rid, msg) => Notifications.notifyUser(userId, 'message', {
	_id: Random.id(),
	rid,
	ts: new Date(),
	msg,
});

class WhatsappApi {
	constructor() {
		this.accountSid = settings.get('SMS_Twilio_Account_SID');
		this.authToken = settings.get('SMS_Twilio_authToken');
		this.numbersend = settings.get('SMS_Twilio_Number_Send');
		this.fileUploadEnabled = settings.get('SMS_Twilio_FileUpload_Enabled');
		this.mediaTypeWhiteList = settings.get('SMS_Twilio_FileUpload_MediaTypeWhiteList');
	}

	parse(data) {
		let numMedia = 0;

		const returnData = {
			from: data.contacts[0].wa_id,
			to: '22222222',//data.To,
			body: data.messages.text.body,

			//extra: {
			//	toCountry: data.ToCountry,
			//	toState: data.ToState,
			//	toCity: data.ToCity,
			//	toZip: data.ToZip,
			//	fromCountry: data.FromCountry,
			//	fromState: data.FromState,
			//	fromCity: data.FromCity,
			//	fromZip: data.FromZip,
			//	fromLatitude: data.Latitude,
			//	fromLongitude: data.Longitude,
			//},
		};
		return returnData;
	}

	send(fromNumber, toNumber, message, extraData) {

		var request = require('request');
		var options = {
		'method': 'POST',
		'url': 'https://host.docker.internal/api/v1/whatsapp/mensagens/nova',
		'headers': {
			'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njk2MTU0MTQsImV4cCI6MTYwMTE1MTQxNCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.mREwY5O_QMFqgWUUPiZEAOCWIFa7zEdkdiXgZo7dHW0',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({"mensagem":message,"destinatario":toNumber})

		};
		request(options, function (error, response) {
		if (error) throw new Error(error);
		console.log(response.body);
		});

		
		client.messages.create({
			to: toNumber,
			from: fromNumber,
			body,
			...mediaUrl && { mediaUrl },
			...persistentAction && { persistentAction },
		});
	}

	response(/* message */) {
		return {
			headers: {
				'Content-Type': 'text/xml',
			},
			body: '<Response></Response>',
		};
	}

	error(error) {
		let message = '';
		if (error.reason) {
			message = `<Message>${ error.reason }</Message>`;
		}
		return {
			headers: {
				'Content-Type': 'text/xml',
			},
			body: `<Response>${ message }</Response>`,
		};
	}
}

SMS.registerService('whatsappapi', whatsappapi);
