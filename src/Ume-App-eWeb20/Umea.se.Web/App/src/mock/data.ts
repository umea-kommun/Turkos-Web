/* tslint:disable */
/* eslint-disable max-len */
export default {
	forms: [
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '374',
				attributes: {
					title: 'Gustav - Läromedel, inköp (denna skapade problem efter inskick)',
					description: '',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'form-2023-10-24T08:09:37129Z',
					integrations: [
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Autosvar: Till beställaren',
									data: {},
									id: 4426,
								},
								{
									key: 'subject',
									value: 'Autosvar: Läromedel, inköp',
									data: {},
									id: 4427,
								},
								{
									key: 'sender',
									value: 'noreply.e-service@testservice.umea.se',
									data: {},
									id: 4428,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [
										'3f789a93-0330-4378-9703-bea1c1551928',
									],
									id: 4429,
								},
								{
									key: 'attachFiles',
									value: 'true',
									data: {},
									id: 4430,
								},
								{
									key: 'body',
									value: '<p>H&auml;r kommer allt som anv&auml;nder skickade in.</p>',
									data: {},
									id: 4431,
								},
							],
							id: 808,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								adminTitle: 'Test',
								title: 'Test',
								url: 'https://www.umea.se/kommun',
								id: 5,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Beställare',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: '(1) För vilken skola gäller beställningen?',
									value: '',
									helpText: 'Välj',
									sortIndex: 7,
									fieldOptions: {
										items: [
											{
												title: 'Dragonskolan',
												isChecked: false,
												id: '12efb5ae-3df5-4272-ac5a-97c3a20ee19b',
												helptext: '',
											},
										],
									},
									guid: 'd0086ce8-db65-4ce8-baa5-9180303a2a5f',
									displayRuleGuids: {},
									displayRuleGroup: {
										displayRuleGroupGuid: '',
										queryOption: '',
										conditions: [],
										groups: [],
										id: 0,
									},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 3889,
								},
								{
									type: 'FieldTextBox',
									title: '(2) Telefon',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {},
									guid: 'c1a8d9d4-d470-4686-81e3-5425640a1fa6',
									displayRuleGuids: {},
									displayRuleGroup: {
										displayRuleGroupGuid: '',
										queryOption: '',
										conditions: [],
										groups: [],
										id: 0,
									},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 3890,
								},
								{
									type: 'FieldTextBox',
									title: '(3) Namn',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {},
									guid: '1c24655c-4eb6-4fbb-9018-5a96be15889b',
									displayRuleGuids: {},
									displayRuleGroup: {
										displayRuleGroupGuid: '',
										queryOption: '',
										conditions: [],
										groups: [],
										id: 0,
									},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 3891,
								},
								{
									type: 'FieldTextBox',
									title: '(4) Titel',
									value: '',
									helpText: '',
									sortIndex: 10,
									fieldOptions: {
										tableGuid:
											'd711c458-67fe-4675-ad0c-d61090d9e8fe',
										columnWidth: 3,
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'a085091e-1ef8-4df4-bc94-490aaac3a4c1',
									displayRuleGuids: {},
									displayRuleGroup: {
										displayRuleGroupGuid: '',
										queryOption: '',
										conditions: [],
										groups: [],
										id: 0,
									},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 3895,
								},

								{
									type: 'FieldTable',
									title: '(5) Beställning av läromedel',
									value: '',
									helpText:
										'Du kan göra beställningar för 30 titlar åt gången.',
									sortIndex: 8,
									fieldOptions: {
										minRows: 1,
									},
									guid: 'd711c458-67fe-4675-ad0c-d61090d9e8fe',
									displayRuleGuids: {},
									displayRuleGroup: {
										displayRuleGroupGuid: '',
										queryOption: '',
										conditions: [],
										groups: [],
										id: 0,
									},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 3897,
								},
								{
									type: 'FieldTextBox',
									title: '(6) Kostnadsställe (KST)',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {},
									guid: '6b88fd5d-1461-4ce4-a352-bd8da6d64963',
									displayRuleGuids: {},
									displayRuleGroup: {
										displayRuleGroupGuid: '',
										queryOption: '',
										conditions: [],
										groups: [],
										id: 0,
									},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 3898,
								},
							],
							sortIndex: 0,
							id: 540,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Anställd i Umeå kommun',
							id: 11,
						},
					],
					categories: [
						{
							title: 'Barn och utbildning',
							id: 1,
						},
					],
					pM3: {
						title: 'Test',
						id: 44,
					},
					receiver: {
						adminTitle: 'Test',
						title: 'Test',
						url: '',
						id: 28,
					},
					templateGuid: '',
					createdBy: 'test.testsson@test.se',
					created: '2023-10-24T08:09:37.278426',
					modifiedBy: 'test.testsson@test.se',
					modified: '2023-10-24T09:37:01.982331',
					dateSchedule: {
						from: '2023-10-24T08:10:41.8967797Z',
						to: '2023-10-24T08:10:41.8967818Z',
						active: false,
						formId: 374,
						id: 272,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						trustLevel: 3,
						formId: 374,
						canApplyForAnother: false,
						authClient: ['Azure ActiveDirectory'],
						showUserContactInformation: false,
						multipleLegitimation: false,
						contactPaths: [],
						id: 355,
					},
					hidden: true,
					hidePersonNumber: false,
					simpleEservice: false,
					disablePrintPdf: false,
					printFieldPersonnumber: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
						id: 249,
					},
					recentSubmits: 0,
				},
				type: 'form',
			},
			errors: [],
			id: 374,
		},
		{
			links: {
				self: 'http://localhost:8080',
			},
			data: {
				id: '53',
				attributes: {
					title: 'robbohs skräddarsydda',
					description: '',
					status: 'Published',
					type: 'EService',
					path: 'form-2020-02-25T13:29:03924Z',
					integrations: [
						{
							type: 'Email',
							options: [
								{
									key: 'sender',
									value: 'test.testsson@test.se',
									data: {},
									id: 968,
								},
								{
									key: 'receiver',
									value: 'test.testsson@test.se',
									data: {},
									id: 969,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [],
									id: 970,
								},
								{
									key: 'attachFiles',
									value: 'true',
									data: {},
									id: 971,
								},
								{
									key: 'title',
									value: 'Skicka till mig',
									data: {},
									id: 972,
								},
								{
									key: 'body',
									value: '',
									data: {},
									id: 973,
								},
								{
									key: 'subject',
									value: 'Mutipel legitemering',
									data: {},
									id: 974,
								},
							],
							id: 128,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Styrelsen',
								url: 'https://www.any.com/start.html',
								id: 12,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg...',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Välj i listan',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Children',
											options: {
												itemProperty: 'Name',
											},
										},
										items: [
											{
												title: 'Fnatte Anka',
												id: 'Fnatte Anka',
												isChecked: true,
											},
											{
												title: 'Tjatte Anka',
												id: 'Tjatte Anka',
												isChecked: false,
											},
										],
										contactInfo: [
											{
												id: 'Fnatte Anka',
												childSocialSecurityNumber:
													'121212121212',
												childName: 'Fnatte Anka',
												childFirstName: 'Fnatte',
												childLastName: 'Anka',
												socialSecurityNumber:
													'121212121212',
												name: 'Uno Kuno',
												address: 'ANKGATAN 3',
												postalNumber: '12345',
												city: 'ANKEBORG',
												phoneNumber: '',
												email: 'test.testsson@test.se',
												isSelected: true,
											},
											{
												id: 'Tjatte Anka',
												childSocialSecurityNumber:
													'121212121212',
												childName: 'Tjatte Anka',
												childFirstName: 'Tjatte',
												childLastName: 'Anka',
												socialSecurityNumber:
													'121212121212',
												name: 'Uno Kuno',
												address: 'ANKGATAN 3',
												postalNumber: '12345',
												city: 'ANKEBORG',
												phoneNumber: '',
												email: '',
												isSelected: false,
											},
										],
									},
									guid: '92f49299-6e10-4b90-a4c4-007ce86fc04a',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: true,
									id: 646,
								},
								{
									type: 'FieldCheckBox',
									title: 'Samtycke till fotografering',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										items: [
											{
												title: 'Ja, jag samtycker till att skolan/förskolan fotograferar mitt barn i skolsituationer und so weiter',
												isChecked: true,
												id: 'f4baf551-8a95-4492-8b72-e5f50a9cadcb',
											},
										],
									},
									guid: '2c519f62-6887-48c3-a9be-b79b1f214f8c',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 647,
								},
							],
							sortIndex: 71,
							id: 71,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Tanka',
							id: 1,
						},
					],
					categories: [
						{
							title: 'Bygga & Bo',
							id: 1,
						},
					],
					pM3: {
						title: 'Omsorg',
						id: 4,
					},
					receiver: {
						title: 'Styrelsen',
						url: 'https://www.any.com/start.html',
						id: 12,
					},
					createdBy: 'test.testsson@test.se',
					created: '2020-02-25T13:29:04.4552123',
					modifiedBy: 'test.testsson@test.se',
					modified: '2020-06-09T11:56:20.0087436',
					dateSchedule: {
						from: '2020-02-26T09:22:30.0467515Z',
						to: '2020-02-26T09:22:30.0467587Z',
						active: false,
						formId: 53,
						id: 30,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 53,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: true,
						contactPaths: [1, 2],
						id: 34,
					},
					hidden: false,
					hidePersonNumber: false,
					printFieldPersonnumber: false,
					simpleEservice: false,
					usersLegitimations: [
						{
							refId: '54c832fd-bea9-47db-bff4-bbe84e841d47',
							name: 'KALLE ANKA',
							legitimizedMethod: 'BankId',
							legitimizedDateTime: '2020-06-09 14:11:36',
						},
					],
					userContactInfos: [
						{
							id: 'Fnatte Anka',
							childSocialSecurityNumber: '121212121212',
							childName: 'Fnatte Anka',
							childFirstName: 'Fnatte',
							childLastName: 'Anka',
							socialSecurityNumber: '121212121212',
							name: 'Uno Kuno',
							address: 'ANKGATAN 3',
							postalNumber: '12345',
							city: 'ANKEBORG',
							phoneNumber: '',
							email: 'test.testsson@test.se',
							isSelected: true,
						},
					],
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			userContactInfo: {
				socialSecurityNumber: '121212121212',
				firstName: 'KALLE',
				lastName: 'ANKA',
				address: 'ANKGATAN 3',
				postalNumber: '12345',
				city: 'ANKEBORG',
				phoneNumber: '',
				email: '',
			},
			id: 53,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '63',
				attributes: {
					title: 'Ersättning vid studier',
					description: '<p>Test</p>',
					status: 'Draft',
					type: 'EService',
					path: 'ersattning-studie',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 841,
								},
							],
							id: 149,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Styrelsen',
								url: 'https://umea.se/umeakommun/kulturochfritid/idrottmotionochfriluftsliv/friluftslivochmotion.4.bbd1b101a585d7048000151298.html',
								id: 12,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg...',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Ska studera',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										items: [
											{
												title: 'Välj',
												isChecked: true,
												id: 'f2781915-fbbd-4203-8b67-236a6ee5c300',
											},
											{
												title: 'Vård 1',
												isChecked: false,
												id: '9beb0340-4432-448f-b055-9068ee57e57a',
											},
											{
												title: 'Vård 2',
												isChecked: false,
												id: 'a99c9d41-e9d6-4599-964c-7b99fdebfd57',
											},
											{
												title: 'Vård 3',
												isChecked: false,
												id: '98f50835-762b-4179-8f2a-01715c5725d4',
											},
											{
												title: 'Vård 4',
												isChecked: false,
												id: 'a409bf8b-2843-42dc-af66-8c547a65394c',
											},
										],
									},
									guid: 'bf5cc1bc-09bb-4875-8548-563f642b8239',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 465,
								},
								{
									type: 'FieldRadioButton',
									title: 'Studieort',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										items: [
											{
												title: 'Umeå',
												isChecked: false,
												id: '69dc04d8-3754-4a78-b536-7ef8cf3eccd8',
											},
											{
												title: 'Annat',
												isChecked: false,
												id: 'd0c4f098-8d30-4434-b48a-f9433a592540',
											},
										],
									},
									guid: 'd99a0ee7-558f-47aa-8df4-b8022694de38',
									displayRuleGuids: [
										'a6b46c92-08db-46a1-8981-e9d0bc2e0b9e',
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 466,
								},
								{
									type: 'FieldRadioButton',
									title: 'Studieort',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										items: [
											{
												title: 'Umeå',
												isChecked: false,
												id: 'eb2f67c7-5c34-485c-bb22-d8f249115b01',
											},
										],
									},
									guid: 'be20994a-5c9e-44d6-892b-0dc582434812',
									displayRuleGuids: [
										'8b69488e-4786-48bf-9a1b-3106a1c922fa',
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 467,
								},
								{
									type: 'FieldCheckBox',
									title: 'Stöd',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										items: [
											{
												title: 'Fyra',
												isChecked: false,
												id: '8a682b71-b888-4175-b373-dc7c766209b3',
											},
										],
									},
									guid: '4ede73c8-204e-4df5-8a82-6d5732f59614',
									displayRuleGuids: [
										'25d7ea77-f7d0-49a4-9085-495a21f5f0a6',
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 468,
								},
								{
									type: 'FieldCheckBox',
									title: 'Stöd',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {
										items: [
											{
												title: 'Fyra',
												isChecked: false,
												id: '43a7c282-a054-4dcb-841f-8ae3dfbd8f3e',
											},
											{
												title: 'Lön',
												isChecked: false,
												id: '3ea6ca52-e4da-49ff-9ed5-8993ed657ed9',
											},
										],
									},
									guid: '1002d2cc-1b3d-4755-bfbe-c31917206966',
									displayRuleGuids: [
										'23427eef-2ea5-4784-8975-201ff4dfd8c0',
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 469,
								},
								{
									type: 'FieldTextBox',
									title: 'Kurs start',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {},
									guid: 'e396fbe0-c0d0-44a8-a16f-30eac4c469d3',
									displayRuleGuids: [
										'437f9586-98d8-42a1-9691-7a46a602f76c',
										'71f66549-304e-4655-b3e2-38376bd01d2b',
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 470,
								},
							],
							sortIndex: 0,
							id: 100,
						},
					],
					displayRules: [
						{
							guid: 'a6b46c92-08db-46a1-8981-e9d0bc2e0b9e',
							title: 'Studieort 1',
							fieldGuid: 'bf5cc1bc-09bb-4875-8548-563f642b8239',
							fieldOptionId:
								'9beb0340-4432-448f-b055-9068ee57e57a',
							formId: 63,
							colorCode: '#af456a',
							id: 116,
						},
						{
							guid: '8b69488e-4786-48bf-9a1b-3106a1c922fa',
							title: 'Studieort 2',
							fieldGuid: 'bf5cc1bc-09bb-4875-8548-563f642b8239',
							fieldOptionId:
								'a99c9d41-e9d6-4599-964c-7b99fdebfd57',
							formId: 63,
							colorCode: '#4b0ca',
							id: 117,
						},
						{
							guid: '25d7ea77-f7d0-49a4-9085-495a21f5f0a6',
							title: 'Stöd 1',
							fieldGuid: 'bf5cc1bc-09bb-4875-8548-563f642b8239',
							fieldOptionId:
								'9beb0340-4432-448f-b055-9068ee57e57a',
							formId: 63,
							colorCode: '#3b37a5',
							id: 118,
						},
						{
							guid: '23427eef-2ea5-4784-8975-201ff4dfd8c0',
							title: 'Stöd 2',
							fieldGuid: 'bf5cc1bc-09bb-4875-8548-563f642b8239',
							fieldOptionId:
								'a99c9d41-e9d6-4599-964c-7b99fdebfd57',
							formId: 63,
							colorCode: '#aa92e1',
							id: 119,
						},
						{
							guid: '437f9586-98d8-42a1-9691-7a46a602f76c',
							title: 'Kursstart 1',
							fieldGuid: 'bf5cc1bc-09bb-4875-8548-563f642b8239',
							fieldOptionId:
								'9beb0340-4432-448f-b055-9068ee57e57a',
							formId: 63,
							colorCode: '#147039',
							id: 120,
						},
						{
							guid: '71f66549-304e-4655-b3e2-38376bd01d2b',
							title: 'Kursstart 2',
							fieldGuid: 'bf5cc1bc-09bb-4875-8548-563f642b8239',
							fieldOptionId:
								'a99c9d41-e9d6-4599-964c-7b99fdebfd57',
							formId: 63,
							colorCode: '#9ae577',
							id: 121,
						},
					],
					lifeSituations: [
						{
							title: 'Resa',
							id: 99,
						},
					],
					categories: [
						{
							title: 'Omsorg & hjälp',
							id: 14,
						},
					],
					pM3: {
						title: 'Färdtjänst',
						id: 1,
					},
					receiver: {
						title: 'Administration och innovation',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 13,
					},
					createdBy: 'kajsa.andersson@test.se',
					created: '2019-01-10T10:51:33.6544013',
					modifiedBy: 'kalle.andersson@test.se',
					modified: '2019-04-01T12:36:23.4140344',
					dateSchedule: {
						from: '2020-03-25T08:42:37.3576671Z',
						to: '2020-03-25T08:42:37.3576758Z',
						active: false,
						formId: 63,
						id: 39,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 63,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: false,
						id: 44,
					},
					hidden: false,
					hidePersonNumber: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 63,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '74',
				attributes: {
					title: 'Multipel legitimering',
					description: '<p>Test</p>',
					status: 'Published',
					type: 'EService',
					path: 'multipel-legitimering',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 951,
								},
							],
							id: 166,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Styrelsen',
								url: 'https://www.any.com/start.html',
								id: 12,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg 1',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Barn',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Children',
											options: {
												itemProperty: 'name',
											},
										},
									},
									guid: '4261c8ac-0b52-4bb8-83aa-006895c76776',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: true,
									id: 617,
								},
							],
							sortIndex: 0,
							id: 118,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Resa',
							id: 99,
						},
					],
					categories: [
						{
							title: 'Bygga & Bo',
							id: 1,
						},
					],
					pM3: {
						title: 'Färdtjänst',
						id: 1,
					},
					receiver: {
						title: 'Administration och innovation',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 13,
					},
					createdBy: 'anna.anka@test.se',
					created: '2020-05-20T11:54:16.4905697',
					modifiedBy: 'anna.anka@test.se',
					modified: '2020-05-20T12:10:24.1764171',
					dateSchedule: {
						from: '2020-05-20T12:07:50.6831708Z',
						to: '2020-05-20T12:07:50.6831732Z',
						active: false,
						formId: 74,
						id: 50,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 74,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: true,
						contactPaths: [1, 2],
						id: 55,
					},
					hidden: false,
					hidePersonNumber: false,
					printFieldPersonnumber: false,
					simpleEservice: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 74,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '91',
				attributes: {
					title: 'Ungdomar, sommarjobb',
					description: '<p>Ungdomar, sommarjobb</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'ungdomar-sommarjobb',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 1152,
								},
							],
							id: 200,
						},
						{
							type: 'OnPrem',
							options: [
								{
									key: 'title',
									value: 'Ungdom, sökande',
									data: {},
									id: 1331,
								},
								{
									key: 'datasourcename',
									value: 'Sookande',
									data: {},
									id: 1332,
								},
							],
							id: 231,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://www.any.com/start.html',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Uppgifter om sökande',
							description: '',
							fields: [
								// {
								// 	type: 'FieldPersonalNumber',
								// 	title: 'Personnummer',
								// 	value: '',
								// 	helpText: '',
								// 	sortIndex: 1,
								// 	fieldOptions: {
								// 		dataSource: {
								// 			dataSourceName: 'Sookande',
								// 			options: {
								// 				itemProperty: 'SookandePnr',
								// 			},
								// 		},
								// 	},
								// 	guid: '5aedd092-d223-48a1-bdbc-223ae98096ef',
								// 	displayRuleGuids: [],
								// 	displayRuleAnother: false,
								// 	displayRuleMultipleLegitimation: false,
								// 	id: 1257,
								// },
								{
									type: 'FieldTextBox',
									title: 'Förnamn',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Sookande',
											options: {
												itemProperty:
													'SookandeFoornamn',
											},
										},
									},
									guid: '5b45701e-cb79-424e-90df-94c20b06e023',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1205,
								},
								{
									type: 'FieldTextBox',
									title: 'Efternamn',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Sookande',
											options: {
												itemProperty:
													'SookandeEfternamn',
											},
										},
									},
									guid: '21f734ea-8211-48db-92f8-0ede792e65c2',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1206,
								},
								{
									type: 'FieldTextBox',
									title: 'Gatuadress',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Sookande',
											options: {
												itemProperty:
													'SookandeGatuadress',
											},
										},
									},
									guid: '5fc12fda-620f-46f7-8383-8665f6827989',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1207,
								},
								{
									type: 'FieldTextBox',
									title: 'Postnummer',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Sookande',
											options: {
												itemProperty: 'SookandePostnr',
											},
										},
									},
									guid: 'dca73da5-c55c-43b6-bd9c-851b60306040',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1208,
								},
								{
									type: 'FieldTextBox',
									title: 'Ort',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Sookande',
											options: {
												itemProperty:
													'SookandePostadress',
											},
										},
									},
									guid: '42d71138-a75c-46dd-aaf4-8b2e86a49502',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1200,
								},
								{
									type: 'FieldSelectList',
									title: 'Stadsdel/by',
									value: '',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Stadsdelar',
											options: {
												itemProperty:
													'StadsdelKlartext',
											},
										},
									},
									guid: '3b53b3c6-7f6e-4306-9371-9619e0247d39',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1210,
								},
								{
									type: 'FieldTextBox',
									title: 'Epostadress',
									value: '',
									helpText: '',
									sortIndex: 8,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Sookande',
											options: {
												itemProperty:
													'SookandeEpostadress',
											},
										},
									},
									guid: '655bfe8b-d7c5-402e-8560-724177f56daf',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1211,
								},
								{
									type: 'FieldTextBox',
									title: 'Mobilnummer',
									value: '',
									helpText: '',
									sortIndex: 9,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Sookande',
											options: {
												itemProperty: 'SookandeMobilnr',
											},
										},
									},
									guid: '465bbba6-14af-4e04-9b70-c4c4cff66ad9',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1209,
								},
								{
									type: 'FieldTextBox',
									title: 'Skola',
									value: '',
									helpText: '',
									sortIndex: 10,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Ansookan',
											options: {
												itemProperty: 'AnsookanSkola',
											},
										},
									},
									guid: '3c599c65-b7ff-41c3-8e16-ad274f1b0275',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1203,
								},
								{
									type: 'FieldTextBox',
									title: 'Program',
									value: '',
									helpText: '',
									sortIndex: 11,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Ansookan',
											options: {
												itemProperty: 'AnsookanProgram',
											},
										},
									},
									guid: 'aa03136a-124a-4d47-b364-83ddfc39b0e3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1202,
								},
								{
									type: 'FieldCheckBox',
									title: 'Ange närmaste största samhälle dit du har möjlighet att åka',
									value: '',
									helpText: '',
									sortIndex: 12,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'AnsookanSamhaelle',
											options: { itemProperty: 'Name' },
										},
									},
									guid: 'ca214cc7-b1ef-4719-bfc4-2b8293a798ab',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1201,
								},
							],
							sortIndex: 0,
							id: 148,
						},
						{
							type: 'step',
							title: 'Arbetstillfällen',
							description: '',
							fields: [
								{
									type: 'FieldTable',
									title: 'Kopplad',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbete',
											options: {},
										},
										autofillNumberOfRows: true,
									},
									guid: '86ac4266-732f-4322-9561-fdd2dc2cd52b',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1212,
								},
								{
									type: 'FieldTextBox',
									title: 'Prio',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										tableGuid:
											'86ac4266-732f-4322-9561-fdd2dc2cd52b',
										dataSource: {
											dataSourceName: 'Arbete',
											options: {
												itemProperty: 'ArbetePrio',
											},
										},
										columnWidth: 1,
										validation: [
											{
												title: 'Endast siffror',
												type: 'numeric',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '52c06ea9-356e-4a26-8845-3c6684b676a6',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1213,
								},
								{
									type: 'FieldTextBox',
									title: 'Arbete',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										tableGuid:
											'86ac4266-732f-4322-9561-fdd2dc2cd52b',
										dataSource: {
											dataSourceName: 'Arbete',
											options: {
												itemProperty: 'ArbeteKlartext',
											},
										},
										columnWidth: 3,
										readOnly: true,
									},
									guid: '5333c4d9-eb26-4f31-a13a-502bc3075b82',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1214,
								},
								{
									type: 'FieldTextArea',
									title: 'Info',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										tableGuid:
											'86ac4266-732f-4322-9561-fdd2dc2cd52b',
										dataSource: {
											dataSourceName: 'Arbete',
											options: {
												itemProperty:
													'ArbeteBeskrivning',
											},
										},
										columnWidth: 3,
										readOnly: true,
									},
									guid: 'e4360693-b6f3-4ec9-9453-a4ec6d794c8c',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1215,
								},
								{
									type: 'FieldSelectList',
									title: 'Övriga val',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {
										tableGuid:
											'86ac4266-732f-4322-9561-fdd2dc2cd52b',
										dataSource: {
											dataSourceName: 'Arbete',
											options: {
												itemProperty: 'Arbetsplatser',
											},
										},
										columnWidth: 3,
									},
									guid: 'b93cfe90-cabe-494b-937d-bf6b79d1aeda',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1216,
								},
							],
							sortIndex: 1,
							id: 185,
						},
						{
							type: 'step',
							title: 'Ange under vilka perioder du vill jobba',
							description: '',
							fields: [
								{
									type: 'FieldTable',
									title: 'Under vilka perioder vill du jobba?',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										minRows: 3,
										maxRows: 3,
										dataSource: {
											dataSourceName: 'AktuellaPerioder',
											options: {},
										},
									},
									guid: '3de6cc95-565f-47b1-b0bf-34d1ffaa98ab',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1250,
								},
								{
									type: 'FieldTextBox',
									title: 'Arbetsperiod',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										tableGuid:
											'3de6cc95-565f-47b1-b0bf-34d1ffaa98ab',
										dataSource: {
											dataSourceName: 'AktuellaPerioder',
											options: {
												itemProperty: 'PeriodKlartext',
											},
										},
										columnWidth: 4,
									},
									guid: '9e6dd4e1-3da2-41e2-848c-7cfcfc6bc388',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1251,
								},
								{
									type: 'FieldTextBox',
									title: 'Datum för perioden',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										tableGuid:
											'3de6cc95-565f-47b1-b0bf-34d1ffaa98ab',
										dataSource: {
											dataSourceName: 'AktuellaPerioder',
											options: {
												itemProperty: 'PeriodFomTom',
											},
										},
										columnWidth: 4,
									},
									guid: '9a08e9bc-d168-4219-8e65-5eb7b92cf629',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1253,
								},
								{
									type: 'FieldSelectList',
									title: 'Prio, önskemål period',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										tableGuid:
											'3de6cc95-565f-47b1-b0bf-34d1ffaa98ab',
										dataSource: {
											dataSourceName: 'AktuellaPerioder',
											options: {
												itemProperty:
													'PeriodAnsookningsbar',
											},
										},
										items: [
											{
												title: '1',
												isChecked: false,
												id: 'c86048d4-1908-4788-98cc-6a536a9a5160',
											},
											{
												title: '2',
												isChecked: false,
												id: '0f380e12-183c-4ab1-bab0-3fc8fd1b60c4',
											},
											{
												title: '3',
												isChecked: false,
												id: '9775cbd0-853f-4bf5-b206-c503ba92a5a1',
											},
										],
										columnWidth: 2,
									},
									guid: '8992d6c4-d82c-4cdc-ae26-b04961d5adbb',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1254,
								},
								{
									type: 'FieldTextArea',
									title: 'Har du behov av en mer anpassad arbetssituation',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {},
									guid: '258195ce-5981-40f8-98d1-1bfe06fee740',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1218,
								},
								{
									type: 'FieldTextArea',
									title: 'Ange om du på grund av medicinska eller andra skäl inte kan ta vissa arbeten?',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {},
									guid: 'cb79849b-a8e4-4d0d-a06e-0ccef454b967',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1219,
								},
								{
									type: 'FieldTextArea',
									title: 'Ange dina önskemål om placering',
									value: '',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {},
									guid: '9fcf70ce-5f8c-4e16-9809-2477e110155e',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1220,
								},
							],
							sortIndex: 2,
							id: 184,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Jobb',
							id: 14,
						},
					],
					categories: [
						{
							title: 'Jobb och företagande',
							id: 16,
						},
					],
					pM3: {
						title: 'Arbetsliv',
						id: 5,
					},
					receiver: {
						title: 'Jobbet',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 19,
					},
					createdBy: 'test.testsson@test.se',
					created: '2020-10-30T13:09:34.8147652',
					modifiedBy: 'kajsa.anka@test.se',
					modified: '2021-02-05T10:24:11.0509136',
					dateSchedule: {
						from: '2021-02-01T06:50:45.7221095Z',
						to: '2021-02-01T06:50:45.7221131Z',
						active: false,
						formId: 91,
						id: 80,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 91,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: false,
						multipleLegitimation: false,
						contactPaths: [],
						id: 72,
					},
					hidden: false,
					hidePersonNumber: false,
					printFieldPersonnumber: false,
					simpleEservice: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 91,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '98',
				attributes: {
					title: 'And, or, not',
					description: '<p>Testa</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'form-and-or-not',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 1161,
								},
							],
							id: 208,
						},
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Test inskick',
									data: {},
									id: 1163,
								},
								{
									key: 'subject',
									value: 'And-or-not',
									data: {},
									id: 1164,
								},
								{
									key: 'attachFiles',
									value: 'true',
									data: {},
									id: 1165,
								},
								{
									key: 'body',
									value: '<p>And-or-not</p>',
									data: {},
									id: 1166,
								},
								{
									key: 'sender',
									value: 'noreply.e-service@services.umea.se',
									data: {},
									id: 1167,
								},
								{
									key: 'receiver',
									value: 'kajsa.anka@test.se',
									data: {},
									id: 1168,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [],
									id: 1169,
								},
							],
							id: 210,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://www.any.com/start.html',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg...',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Årstid',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										items: [
											{
												title: 'Välj årstid',
												isChecked: false,
												id: '0baba5a5-6559-48b1-ab02-b42305511bc8',
											},
											{
												title: 'Vinter',
												isChecked: false,
												id: 'eb712323-0bc6-4fe6-a017-ecf84296c8b7',
											},
											{
												title: 'Vår',
												isChecked: false,
												id: '242953dc-babe-43c2-b4b9-4e36d6633e5b',
											},
											{
												title: 'Sommar',
												isChecked: false,
												id: '14b7f0b6-5268-406d-89ac-41ecdc44af83',
											},
											{
												title: 'Höst',
												isChecked: false,
												id: '4e2212d8-6350-4b86-8846-ad1651ccce92',
											},
										],
									},
									guid: '0f154669-5ed2-45a2-904e-0d03abb8b017',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 980,
								},
								{
									type: 'FieldSelectList',
									title: 'Månad',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										items: [
											{
												title: 'Välj månad',
												isChecked: false,
												id: '77f2ebbc-7bdd-433d-b45c-4063bf5817d8',
											},
											{
												title: 'Januari',
												isChecked: false,
												id: '7927c18d-c61d-49d5-bd04-3cc0c374eae6',
											},
											{
												title: 'Februari',
												isChecked: false,
												id: '68ee4c1a-c65e-4c46-92f1-b8f8bc318997',
											},
											{
												title: 'Mars',
												isChecked: false,
												id: 'cd1b8ffa-3908-41de-89cb-8bbeb877f52b',
											},
											{
												title: 'April',
												isChecked: false,
												id: '57c1aa01-d37b-496e-bdbb-063fe6f35e85',
											},
											{
												title: 'Maj',
												isChecked: false,
												id: '2808c5dd-d005-42eb-8fdb-3c07bbd1bed7',
											},
											{
												title: 'Juni',
												isChecked: false,
												id: '67155a34-d4a8-4ead-9639-e3577e800f45',
											},
											{
												title: 'Juli',
												isChecked: false,
												id: '755a4ea0-526a-43d8-aa14-003ece8d0ae5',
											},
											{
												title: 'Augusti',
												isChecked: false,
												id: '50081e56-a3e0-489a-93dd-6fd76df96249',
											},
											{
												title: 'September',
												isChecked: false,
												id: '66b4c353-43ba-4fba-86fd-6cd01bc08625',
											},
											{
												title: 'November',
												isChecked: false,
												id: '8996208b-5d26-42f6-8163-5b5d5852258e',
											},
											{
												title: 'December',
												isChecked: false,
												id: '5da944bf-08e4-4f4b-bbaf-79aaef103a78',
											},
										],
									},
									guid: 'beddbf84-cff4-4ba7-b858-2bed68e50172',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 981,
								},
								{
									type: 'FieldSelectList',
									title: 'Måltid',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										items: [
											{
												title: 'Välj måltid',
												isChecked: false,
												id: '86c654db-0d20-48b4-8bea-af0a36d4a35b',
											},
											{
												title: 'Frukost',
												isChecked: false,
												id: '6ff4d160-b463-4fa0-97ba-e002ba8e9ef7',
											},
											{
												title: 'Lunch',
												isChecked: false,
												id: 'a5f58e2a-5894-42df-9946-aaab695a2f45',
											},
											{
												title: 'Middag',
												isChecked: false,
												id: '92500184-78c8-4c0c-94bd-eff487cd2340',
											},
											{
												title: 'Kvällsfika',
												isChecked: false,
												id: '82ff3a27-0f60-4bfa-b178-0e2579d4c7c7',
											},
										],
									},
									guid: 'ae4b83df-b87f-4437-b820-6b9ca5a439ee',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 982,
								},
								{
									type: 'FieldTextBox',
									title: 'And: Årstid vinter, Månad februari, Not: Måltid frukost',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {},
									guid: '2efc5cf9-b9f1-453a-adeb-1d9eca130db7',
									displayRuleGuids: [
										{
											guid: '2578f71a-a2f6-486c-ba18-c5c02f581c22',
											isOr: false,
											isAnd: false,
											isNot: true,
										},
										{
											guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce87',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
										{
											guid: '8b005090-4627-421d-bc40-15ba7995146f',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 983,
								},
								{
									type: 'FieldTextBox',
									title: 'Or: Årstid sommar, Månad juni och ingen Måltid',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {},
									guid: '4e37138f-07f9-40c6-a533-94fc34a486c8',
									displayRuleGuids: [
										{
											guid: 'e35e0cdf-862f-41f1-9cf2-517f2277f0af',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
										{
											guid: 'ff178de8-1292-4c1d-9981-95c5ec5a08ac',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 984,
								},
								{
									type: 'FieldTextBox',
									title: 'Not: Årstid vår, Or: Månad maj, Måltid lunch',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {},
									guid: '2785518c-a211-4ddf-bb61-1e67bd035368',
									displayRuleGuids: [
										{
											guid: '3440ae46-ac95-4d3d-99ee-999e581f7918',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
										{
											guid: 'a435c915-e035-4e8d-a8b8-8225cdf25063',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
										{
											guid: 'c5ffeff7-204f-4d1e-ad5a-0e80f35e7fb9',
											isOr: false,
											isAnd: false,
											isNot: true,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 985,
								},
								{
									type: 'FieldTextBox',
									title: 'And: Årstid höst, Månad november, Måltid frukost',
									value: '',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {},
									guid: 'd39aed76-0efe-4bf6-9829-2312fa4d6479',
									displayRuleGuids: [
										{
											guid: '2578f71a-a2f6-486c-ba18-c5c02f581c22',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
										{
											guid: '2e4855b7-841e-4795-a591-4abc7e3c65fc',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
										{
											guid: '74699e7a-f6f7-4564-9273-e8d2cf32a832',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 986,
								},
								{
									type: 'FieldTextBox',
									title: 'Or: Årstid sommar, Månad juli, Måltid middag',
									value: '',
									helpText: '',
									sortIndex: 8,
									fieldOptions: {},
									guid: '80d3d153-296e-49da-9561-119e427c525f',
									displayRuleGuids: [
										{
											guid: '54dc91de-bbd0-4279-a181-8c12b3926e39',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
										{
											guid: '02d2ae22-8fcc-470a-afcb-fb5357369bf1',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
										{
											guid: 'e35e0cdf-862f-41f1-9cf2-517f2277f0af',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 987,
								},
								{
									type: 'FieldTextBox',
									title: 'Not: Månad december, And: Årstid vår, Måltid kvällsfika',
									value: '',
									helpText: '',
									sortIndex: 9,
									fieldOptions: {},
									guid: '6e4dc74d-e2b4-4019-b777-9468d462aaf9',
									displayRuleGuids: [
										{
											guid: 'e6d9cfbc-dbbf-4bbe-8a8d-d38ccadbbdb3',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
										{
											guid: 'ebf3f7cd-0f70-4b62-8f89-c902152e7fad',
											isOr: false,
											isAnd: false,
											isNot: true,
										},
										{
											guid: 'c5ffeff7-204f-4d1e-ad5a-0e80f35e7fb9',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 988,
								},
							],
							sortIndex: 0,
							id: 165,
						},
					],
					displayRules: [
						{
							guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce87',
							title: 'Årstid, vinter',
							fieldGuid: '0f154669-5ed2-45a2-904e-0d03abb8b017',
							fieldOptionId:
								'eb712323-0bc6-4fe6-a017-ecf84296c8b7',
							formId: 98,
							colorCode: '#4add97',
							id: 229,
						},
						{
							guid: 'ebf3f7cd-0f70-4b62-8f89-c902152e7fad',
							title: 'Månad, december',
							fieldGuid: 'beddbf84-cff4-4ba7-b858-2bed68e50172',
							fieldOptionId:
								'5da944bf-08e4-4f4b-bbaf-79aaef103a78',
							formId: 98,
							colorCode: '#9b31a8',
							id: 230,
						},
						{
							guid: '2e4855b7-841e-4795-a591-4abc7e3c65fc',
							title: 'Månad, november',
							fieldGuid: 'beddbf84-cff4-4ba7-b858-2bed68e50172',
							fieldOptionId:
								'8996208b-5d26-42f6-8163-5b5d5852258e',
							formId: 98,
							colorCode: '#26b587',
							id: 231,
						},
						{
							guid: 'a435c915-e035-4e8d-a8b8-8225cdf25063',
							title: 'Månad, maj',
							fieldGuid: 'beddbf84-cff4-4ba7-b858-2bed68e50172',
							fieldOptionId:
								'2808c5dd-d005-42eb-8fdb-3c07bbd1bed7',
							formId: 98,
							colorCode: '#c1046',
							id: 232,
						},
						{
							guid: 'ff178de8-1292-4c1d-9981-95c5ec5a08ac',
							title: 'Månad, juni',
							fieldGuid: 'beddbf84-cff4-4ba7-b858-2bed68e50172',
							fieldOptionId:
								'67155a34-d4a8-4ead-9639-e3577e800f45',
							formId: 98,
							colorCode: '#75a9ef',
							id: 233,
						},
						{
							guid: '8b005090-4627-421d-bc40-15ba7995146f',
							title: 'Månad, februari',
							fieldGuid: 'beddbf84-cff4-4ba7-b858-2bed68e50172',
							fieldOptionId:
								'68ee4c1a-c65e-4c46-92f1-b8f8bc318997',
							formId: 98,
							colorCode: '#ad0d38',
							id: 234,
						},
						{
							guid: 'e6d9cfbc-dbbf-4bbe-8a8d-d38ccadbbdb3',
							title: 'Måltid, kvällsfika',
							fieldGuid: 'ae4b83df-b87f-4437-b820-6b9ca5a439ee',
							fieldOptionId:
								'82ff3a27-0f60-4bfa-b178-0e2579d4c7c7',
							formId: 98,
							colorCode: '#aae23a',
							id: 235,
						},
						{
							guid: '02d2ae22-8fcc-470a-afcb-fb5357369bf1',
							title: 'Månad, juli',
							fieldGuid: 'beddbf84-cff4-4ba7-b858-2bed68e50172',
							fieldOptionId:
								'755a4ea0-526a-43d8-aa14-003ece8d0ae5',
							formId: 98,
							colorCode: '#dbe6fb',
							id: 236,
						},
						{
							guid: '3440ae46-ac95-4d3d-99ee-999e581f7918',
							title: 'Måltid, lunch',
							fieldGuid: 'ae4b83df-b87f-4437-b820-6b9ca5a439ee',
							fieldOptionId:
								'a5f58e2a-5894-42df-9946-aaab695a2f45',
							formId: 98,
							colorCode: '#dcb4d8',
							id: 237,
						},
						{
							guid: '2578f71a-a2f6-486c-ba18-c5c02f581c22',
							title: 'Måltid, frukost',
							fieldGuid: 'ae4b83df-b87f-4437-b820-6b9ca5a439ee',
							fieldOptionId:
								'6ff4d160-b463-4fa0-97ba-e002ba8e9ef7',
							formId: 98,
							colorCode: '#8ce535',
							id: 238,
						},
						{
							guid: 'c5ffeff7-204f-4d1e-ad5a-0e80f35e7fb9',
							title: 'Årstid, vår',
							fieldGuid: '0f154669-5ed2-45a2-904e-0d03abb8b017',
							fieldOptionId:
								'242953dc-babe-43c2-b4b9-4e36d6633e5b',
							formId: 98,
							colorCode: '#cc1db8',
							id: 239,
						},
						{
							guid: '74699e7a-f6f7-4564-9273-e8d2cf32a832',
							title: 'Årstid, höst',
							fieldGuid: '0f154669-5ed2-45a2-904e-0d03abb8b017',
							fieldOptionId:
								'4e2212d8-6350-4b86-8846-ad1651ccce92',
							formId: 98,
							colorCode: '#b90c2a',
							id: 240,
						},
						{
							guid: 'e35e0cdf-862f-41f1-9cf2-517f2277f0af',
							title: 'Årstid, sommar',
							fieldGuid: '0f154669-5ed2-45a2-904e-0d03abb8b017',
							fieldOptionId:
								'14b7f0b6-5268-406d-89ac-41ecdc44af83',
							formId: 98,
							colorCode: '#5e2cd8',
							id: 241,
						},
						{
							guid: '54dc91de-bbd0-4279-a181-8c12b3926e39',
							title: 'Måltid, middag',
							fieldGuid: 'ae4b83df-b87f-4437-b820-6b9ca5a439ee',
							fieldOptionId:
								'92500184-78c8-4c0c-94bd-eff487cd2340',
							formId: 98,
							colorCode: '#8e4044',
							id: 242,
						},
					],
					lifeSituations: [
						{
							title: 'Årstider',
							id: 2,
						},
					],
					categories: [
						{
							title: 'Jobb & företagande',
							id: 16,
						},
					],
					pM3: {
						title: 'Omsorg',
						id: 4,
					},
					receiver: {
						title: 'Styrelsen',
						url: 'https://www.any.com/start.html',
						id: 12,
					},
					createdBy: 'test.testsson@test.se',
					created: '2020-11-19T09:30:39.3493411',
					modifiedBy: 'kajsa.anka@test.se',
					modified: '2020-11-30T10:28:05.5113608',
					dateSchedule: {
						from: '2020-11-30T09:41:19.6368576Z',
						to: '2020-11-30T09:41:19.6368686Z',
						active: false,
						formId: 98,
						id: 73,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 98,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: false,
						multipleLegitimation: false,
						contactPaths: [],
						id: 79,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 98,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '114',
				attributes: {
					title: 'Placering för ungdom',
					description: '<p>Placering f&ouml;r ungdom</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'placering-ungdom',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 1566,
								},
							],
							id: 246,
						},
						{
							type: 'OnPrem',
							options: [
								{
									key: 'title',
									value: 'Placering',
									data: {},
									id: 1567,
								},
								{
									key: 'datasourcename',
									value: 'Placering',
									data: {},
									id: 1568,
								},
							],
							id: 247,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://test.se/',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Placering',
							description:
								'När du skickar in ditt svar elektroniskt, får du en kvittens i webbläsaren som säger att ditt svar har kommit in till kommunen.\n\nDet är först när du har fått kvittensen som ditt svar har kommit in till kommunen.',
							fields: [
								{
									type: 'FieldTextBox',
									title: 'Du är erbjuden ferieprao hos:',
									value: 'Svensk markservice.',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										readOnly: true,
										dataSource: {
											dataSourceName: 'Placering',
											options: { itemProperty: 'Namn' },
										},
									},
									guid: '20a61224-b91c-4d74-8c33-93de031125c5',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1346,
								},
								{
									type: 'FieldTextBox',
									title: 'Under tiden:',
									value: '2020-07-27 - 2020-08-14',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										readOnly: true,
										dataSource: {
											dataSourceName: 'Placering',
											options: { itemProperty: 'Period' },
										},
									},
									guid: 'd4e724c5-8aab-4336-a46f-801db489a113',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1344,
								},
								{
									type: 'FieldRadioButton',
									title: 'Vill du ha den erbjudna platsen?',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'PlaceringSvar',
											options: { itemProperty: 'Name' },
										},
										items: [
											{
												title: 'Ja Tack',
												id: 'Ja Tack',
												isChecked: false,
											},
											{
												title: 'Nej Tack',
												id: 'Nej Tack',
												isChecked: false,
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'a16a8326-a549-4306-8845-1e2566dce31b',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1347,
								},
								{
									type: 'FieldTextArea',
									title: 'Är det något du funderar över ta kontakt enligt kontaktuppgifter.',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Placering',
											options: {
												itemProperty: 'Kommentar',
											},
										},
									},
									guid: 'dbe2c2ee-148a-4162-9beb-ce773674ce4a',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1348,
								},
							],
							sortIndex: 0,
							id: 202,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Jobb',
							id: 14,
						},
					],
					categories: [
						{
							title: 'Jobb & företagande',
							id: 16,
						},
					],
					pM3: {
						title: 'Arbetsliv',
						id: 5,
					},
					receiver: {
						title: 'Jobbet',
						url: 'https://www.any.com/start.html',
						id: 19,
					},
					createdBy: 'test@test.se',
					created: '2021-03-15T10:40:03.386574',
					modifiedBy: 'test@test.se',
					modified: '2021-03-17T09:49:59.2841082',
					dateSchedule: {
						from: '2021-03-15T10:42:29.1816948Z',
						to: '2021-03-15T10:42:29.1816977Z',
						active: false,
						formId: 114,
						id: 90,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 114,
						canApplyForAnother: false,
						authClient: ['ElevAd'],
						showUserContactInformation: false,
						multipleLegitimation: false,
						contactPaths: [],
						id: 95,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					printFieldPersonnumber: false,
					usersLegitimations: [
						{
							refId: 'd20806bf-3733-4ff5-b91a-d83fc193ed22',
							name: 'ElevAd\\test',
							legitimizedMethod: 'MINLEG',
							legitimizedDateTime: '2021-03-19 11:25:42',
						},
					],
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 114,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '116',
				attributes: {
					title: 'Skolplacering',
					description:
						'<p>Test - : Som v&aring;rdnadshavare vill jag f&aring; automatiskt kunna f&aring; uppgifter om mitt barns skolplacering i formul&auml;ret</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'e-tjanst-skolplacering',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 1579,
								},
							],
							id: 251,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Styrelsen',
								url: 'https://test.se/',
								id: 12,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg...',
							description: '',
							fields: [
								{
									type: 'FieldTable',
									title: 'Barn, skola, klass',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										minRows: 1,
										dataSource: {
											dataSourceName: 'ChildrenSchool',
											options: {},
										},
									},
									guid: '19a50397-c824-4dc7-8f69-f1df970f1289',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1367,
								},
								{
									type: 'FieldSelectList',
									title: 'Barn',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										tableGuid:
											'19a50397-c824-4dc7-8f69-f1df970f1289',
										dataSource: {
											dataSourceName: 'ChildrenSchool',
											options: {
												itemProperty: 'Children',
												itemFiller: true,
											},
										},
										columnWidth: 4,
									},
									guid: '722ff75e-ae0a-4858-b4c9-85fd89837744',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1368,
								},
								{
									type: 'FieldTextBox',
									title: 'Skola',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										tableGuid:
											'19a50397-c824-4dc7-8f69-f1df970f1289',
										columnWidth: 3,
										dataSource: {
											dataSourceName: 'ChildrenSchool',
											options: {
												itemProperty: 'School',
												itemReciver: true,
											},
										},
									},
									guid: '2c989ff6-c0a1-4143-8332-7a5625dcdcf7',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1369,
								},
								{
									type: 'FieldTextBox',
									title: 'Klass',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										tableGuid:
											'19a50397-c824-4dc7-8f69-f1df970f1289',
										columnWidth: 3,
										dataSource: {
											dataSourceName: 'ChildrenSchool',
											options: {
												itemProperty: 'Class',
												itemReciver: true,
											},
										},
									},
									guid: 'b80b6f1d-7dfa-4ab1-aed8-fc505277949d',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1650,
								},
							],
							sortIndex: 0,
							id: 204,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Jobb',
							id: 14,
						},
					],
					categories: [
						{
							title: 'Bygga & Bo',
							id: 1,
						},
					],
					pM3: {
						title: 'Arbetsliv',
						id: 5,
					},
					receiver: {
						title: 'Jobbet',
						url: 'https://www.any.com/start.html',
						id: 19,
					},
					createdBy: 'test@test.se',
					created: '2021-03-24T09:13:13.04967',
					modifiedBy: 'test@test.se',
					modified: '2021-05-21T06:58:17.3408196',
					dateSchedule: {
						from: '2021-03-24T09:13:42.1591791Z',
						to: '2021-03-24T09:13:42.1591816Z',
						active: false,
						formId: 116,
						id: 92,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 116,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: false,
						contactPaths: [],
						id: 97,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					printFieldPersonnumber: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 116,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '298',
				attributes: {
					title: 'Två inloggningar',
					description: '<p>Testar flera inloggningar</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'form-meta-data-display-rule-two-logg',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 1161,
								},
							],
							id: 208,
						},
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Test inskick',
									data: {},
									id: 1163,
								},
								{
									key: 'subject',
									value: 'Visningsregel',
									data: {},
									id: 1164,
								},
								{
									key: 'attachFiles',
									value: 'true',
									data: {},
									id: 1165,
								},
								{
									key: 'body',
									value: '<p>Visningsregel</p>',
									data: {},
									id: 1166,
								},
								{
									key: 'sender',
									value: 'noreply.e-service@services.umea.se',
									data: {},
									id: 1167,
								},
								{
									key: 'receiver',
									value: 'kajsa.anka@test.se',
									data: {},
									id: 1168,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [],
									id: 1169,
								},
							],
							id: 210,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Styrelsen',
								url: 'https://www.any.com/start.html',
								id: 12,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg...',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Årstid',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										items: [
											{
												title: 'Välj årstid',
												isChecked: false,
												id: '0baba5a5-6559-48b1-ab02-ef2305511bc8',
											},
											{
												title: 'Vinter',
												isChecked: false,
												id: 'eb712323-0bc6-4fe6-a017-abf84296c8b7',
											},
											{
												title: 'Vår',
												isChecked: false,
												id: '242953dc-babe-43c2-b4b9-3e36d6633e5b',
											},
											{
												title: 'Sommar',
												isChecked: false,
												id: '14b7f0b6-5268-406d-89ac-41ecdc44af83',
											},
											{
												title: 'Höst',
												isChecked: false,
												id: '4e2212d8-6350-4b86-8846-ad1651ccce92',
											},
										],
									},
									guid: '0f154669-5ed2-45a2-904e-1103abb8b017',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 980,
								},
								{
									type: 'FieldTextBox',
									title: 'Or: Årstid vinter',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {},
									guid: '2efc5cf9-b9f1-453a-adeb-1d9eca130db7',
									displayRuleGuids: [
										{
											guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce87',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 983,
								},
								{
									type: 'FieldTextBox',
									title: 'OR: Meta, Årstid Sommar',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {},
									guid: '4e37138f-07f9-40c6-a533-94fc34a486c8',
									displayRuleGuids: [
										{
											guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce97',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
										{
											guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce45',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 984,
								},
								{
									type: 'FieldTextBox',
									title: 'AND: Meta, Årstid Sommar',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {},
									guid: '4e37138f-07f9-40c6-a533-94fc34a48645',
									displayRuleGuids: [
										{
											guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce97',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
										{
											guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce45',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 994,
								},
								{
									type: 'FieldTextBox',
									title: 'Not: Meta, AND Årstid Sommar',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {},
									guid: '4e37138f-07f9-40c6-a533-94fc34a48555',
									displayRuleGuids: [
										{
											guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce97',
											isOr: false,
											isAnd: false,
											isNot: true,
										},
										{
											guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce45',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 898,
								},
							],
							sortIndex: 0,
							id: 165,
						},
					],
					displayRules: [
						{
							guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce87',
							metadata: '',
							title: 'Årstid, vinter',
							fieldGuid: '0f154669-5ed2-45a2-904e-1103abb8b017',
							fieldOptionId:
								'eb712323-0bc6-4fe6-a017-abf84296c8b7',
							formId: 298,
							colorCode: '#4add97',
							id: 229,
						},
						{
							guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce45',
							metadata: '',
							title: 'Årstid, sommar',
							fieldGuid: '0f154669-5ed2-45a2-904e-1103abb8b017',
							fieldOptionId:
								'14b7f0b6-5268-406d-89ac-41ecdc44af83',
							formId: 298,
							colorCode: '#4add97',
							id: 239,
						},
						{
							guid: '3f9f368e-bb1a-4d70-89ef-200dd1a4ce97',
							metadata:
								'{"metaDataType": "IUser","metaDataParameter": "authClientName"}',
							title: 'ElevAd check',
							fieldGuid: '206e9cc3-7889-4fee-8f2f-a4aee5960bba',
							fieldOptionId: 'ElevAd',
							formId: 298,
							colorCode: '#fdc827',
							id: 249,
						},
					],
					lifeSituations: [
						{
							title: 'Årstider',
							id: 2,
						},
					],
					categories: [
						{
							title: 'Omsorg & hjälp',
							id: 14,
						},
					],
					pM3: {
						title: 'Omsorg',
						id: 4,
					},
					receiver: {
						title: 'Styrelsen',
						url: 'https://www.any.com/start.html',
						id: 12,
					},
					createdBy: 'test.testsson@test.se',
					created: '2020-11-19T09:30:39.3493411',
					modifiedBy: 'kajsa.anka@test.se',
					modified: '2020-11-30T10:28:05.5113608',
					dateSchedule: {
						from: '2020-11-30T09:41:19.6368576Z',
						to: '2020-11-30T09:41:19.6368686Z',
						active: false,
						formId: 298,
						id: 73,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 298,
						canApplyForAnother: false,
						authClient: ['Publik', 'Anonym'],
						showUserContactInformation: false,
						multipleLegitimation: false,
						contactPaths: [],
						id: 79,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 298,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '398',
				attributes: {
					title: 'Två olika sorters visningsregler',
					description: '<p>Testa</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'form-meta-data-display-rule',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 1261,
								},
							],
							id: 308,
						},
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Test inskick',
									data: {},
									id: 1363,
								},
								{
									key: 'subject',
									value: 'Visningsregel',
									data: {},
									id: 1364,
								},
								{
									key: 'attachFiles',
									value: 'true',
									data: {},
									id: 1365,
								},
								{
									key: 'body',
									value: '<p>Visningsregel</p>',
									data: {},
									id: 1366,
								},
								{
									key: 'sender',
									value: 'noreply.e-service@services.umea.se',
									data: {},
									id: 1367,
								},
								{
									key: 'receiver',
									value: 'kajsa.anka@test.se',
									data: {},
									id: 1368,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [],
									id: 1369,
								},
							],
							id: 310,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://www.any.com/start.html',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg...',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Årstid',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										items: [
											{
												title: 'Välj årstid',
												isChecked: false,
												id: '0baba5a5-6559-48b1-ab02-ef2305511bc8',
											},
											{
												title: 'Vinter',
												isChecked: false,
												id: 'eb712323-0bc6-4fe6-a017-bbf84296c8b7',
											},
											{
												title: 'Vår',
												isChecked: false,
												id: '242953dc-babe-43c2-b4b9-3e36d6633e5b',
											},
											{
												title: 'Sommar',
												isChecked: false,
												id: '14b7f0b6-5268-406d-89ac-43ecdc44af83',
											},
											{
												title: 'Höst',
												isChecked: false,
												id: '4e2212d8-6350-4b86-8846-ad1651ccce92',
											},
										],
									},
									guid: '0f154669-5ed2-45a2-904e-2103abb8b017',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 880,
								},
								{
									type: 'FieldTextBox',
									title: 'Or: Årstid vinter',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {},
									guid: '2efc5cf9-b9f1-453a-adeb-1d9eca130db7',
									displayRuleGuids: [
										{
											guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce87',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 883,
								},
								{
									type: 'FieldTextBox',
									title: 'OR: Meta, Årstid Sommar',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {},
									guid: '4e37138f-07f9-40c6-a533-94fc34a486c8',
									displayRuleGuids: [
										{
											guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce97',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
										{
											guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce45',
											isOr: true,
											isAnd: false,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 884,
								},
								{
									type: 'FieldTextBox',
									title: 'AND: Meta, Årstid Sommar',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {},
									guid: '4e37138f-07f9-40c6-a533-94fc34a48645',
									displayRuleGuids: [
										{
											guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce97',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
										{
											guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce45',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 894,
								},
								{
									type: 'FieldTextBox',
									title: 'Not: Meta, AND Årstid Sommar',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {},
									guid: '4e37138f-07f9-40c6-a533-94fc34a48555',
									displayRuleGuids: [
										{
											guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce97',
											isOr: false,
											isAnd: false,
											isNot: true,
										},
										{
											guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce45',
											isOr: false,
											isAnd: true,
											isNot: false,
										},
									],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 895,
								},
							],
							sortIndex: 0,
							id: 265,
						},
					],
					displayRules: [
						{
							guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce87',
							metadata: '',
							title: 'Årstid, vinter',
							fieldGuid: '0f154669-5ed2-45a2-904e-2103abb8b017',
							fieldOptionId:
								'eb712323-0bc6-4fe6-a017-bbf84296c8b7',
							formId: 398,
							colorCode: '#4add97',
							id: 329,
						},
						{
							guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce45',
							metadata: '',
							title: 'Årstid, sommar',
							fieldGuid: '0f154669-5ed2-45a2-904e-2103abb8b017',
							fieldOptionId:
								'14b7f0b6-5268-406d-89ac-43ecdc44af83',
							formId: 398,
							colorCode: '#4add97',
							id: 339,
						},
						{
							guid: '3f9f368e-bb1a-4d70-89ef-300dd1a4ce97',
							metadata:
								'{"metaDataType": "IUser","metaDataParameter": "authClientName"}',
							title: 'ElevAd check',
							fieldGuid: '206e9cc3-7889-4fee-8f2f-a4aee5960bba',
							fieldOptionId: 'ElevAd',
							formId: 398,
							colorCode: '#fdc827',
							id: 349,
						},
					],
					lifeSituations: [
						{
							title: 'Årstider',
							id: 2,
						},
					],
					categories: [
						{
							title: 'Omsorg & hjälp',
							id: 14,
						},
					],
					pM3: {
						title: 'Omsorg',
						id: 4,
					},
					receiver: {
						title: 'Styrelsen',
						url: 'https://www.any.com/start.html',
						id: 12,
					},
					createdBy: 'test.testsson@test.se',
					created: '2020-11-19T09:30:39.3493411',
					modifiedBy: 'kajsa.anka@test.se',
					modified: '2020-11-30T10:28:05.5113608',
					dateSchedule: {
						from: '2020-11-30T09:41:19.6368576Z',
						to: '2020-11-30T09:41:19.6368686Z',
						active: false,
						formId: 398,
						id: 83,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 398,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: false,
						multipleLegitimation: false,
						contactPaths: [],
						id: 89,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 398,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '1001',
				attributes: {
					title: 'Intresseanmälan - visningstjänst',
					description:
						'<p>I den h&auml;r e-tj&auml;nsten visas de funktioner som det nya verktyget f&ouml;r enkel dataf&aring;ngst har. Namn p&aring; f&auml;lt osv. kan &auml;ndras utifr&aring;n behov och &auml;ndringsbeslut fr&aring;n kommunikationsenheten. F&ouml;r att starta e-tj&auml;nsten tryck p&aring; &rdquo;Starta&rdquo;.</p>',
					status: 'Published',
					type: 'EService',
					hidden: false,
					hidePersonNumber: false,
					userRequirement: {
						addressMandatory: true,
						emailMandatory: true,
						phoneNumberMandatory: false,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: false,
						multipleLegitimation: false,
					},
					applyingForAnother: false,
					path: 'Visningstjanst',
					comments: [
						{
							guid: '3a',
							text: 'Kommentar 2 en väldigt lång kommentar som visas på många ställen',
							timestamp: '2020-01-10T10:51:33.6544013',
							userEmail: 'kalle.andersson@test.se',
						},
						{
							guid: '3a',
							text: 'Kommentar 1 en väldigt lång kommentar som visas på många ställen  en väldigt lång kommentar som visas på många ställen  en väldigt lång kommentar som visas på många ställen',
							timestamp: '2020-01-04T10:51:33.6544013',
							userEmail: 'robert.andersson@test.se',
						},
					],
					integrations: [
						{
							type: 'Sharepoint',
							options: [
								{
									key: 'title',
									value: 'Till SP - IT Test och utveckling',
									id: 112,
								},
								{
									key: 'siteTitle',
									value: 'IT test och utveckling',
									id: 113,
								},
								{
									key: 'userEmail',
									value: 'kajsa.andersson@test.se',
									id: 114,
								},
								{
									key: 'anonymizeTitle',
									value: 'false',
									id: 115,
								},
							],
							id: 3,
						},
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Mejl till Lena',
									id: 85,
								},
								{
									key: 'subject',
									value: 'Ny insickning av visningstjänsten',
									id: 86,
								},
								{
									key: 'attachFiles',
									value: 'false',
									id: 87,
								},
								{
									key: 'body',
									value: '<p>Dokumentet finns i underplats h&auml;r <a href="https://umea.sharepoint.com/sites/BasicUse" target="_blank" rel="noopener">Samlingsplats BasicUse</a></p>',
									id: 88,
								},
								{
									key: 'sender',
									value: 'noreply@test.se',
									id: 89,
								},
								{
									key: 'receiver',
									value: 'kajsa.andersson@test.se',
									id: 90,
								},
							],
							id: 11,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://www.any.com/start.html',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							sortIndex: 3,
							title: 'Intresse',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Välj intresseområde',
									value: '',
									helpText: 'Du kan välja ett alternativ',
									sortIndex: 1,
									fieldOptions: {
										items: [
											{
												title: 'Fågel',
												isChecked: false,
												id: '-93209',
											},
											{
												title: 'Fisk',
												isChecked: false,
												id: '-97208',
											},
											{
												title: 'Mittemellan',
												isChecked: false,
												id: '-47875',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c5fe918e-030f-444c-bee6-00c121889b2f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 54,
								},
								{
									type: 'FieldCheckBox',
									title: 'Vilka årstider tycker du om?',
									value: '',
									helpText:
										'Du kan välja ett eller flera alternativ',
									sortIndex: 3,
									fieldOptions: {
										items: [
											{
												title: 'Vinter',
												isChecked: false,
												id: '-37935',
											},
											{
												title: 'Vårvinter',
												isChecked: false,
												id: '-10155',
											},
											{
												title: 'Vår',
												isChecked: false,
												id: '-38553',
											},
											{
												title: 'Försommar',
												isChecked: false,
												id: '-90975',
											},
											{
												title: 'Högsommar',
												isChecked: false,
												id: '-74828',
											},
											{
												title: 'Sensommar',
												isChecked: false,
												id: '-78452',
											},
											{
												title: 'Höst',
												isChecked: false,
												id: '-96467',
											},
										],
									},
									guid: 'c99f4fc4-983b-4a85-8256-6412a8ab1d9e',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 55,
								},
								{
									type: 'FieldRadioButton',
									title: 'Är det din favorit?',
									value: '',
									helpText: 'Du kan välja ett alternativ',
									sortIndex: 2,
									fieldOptions: {
										items: [
											{
												title: 'Ja',
												isChecked: false,
												id: '-73762',
											},
											{
												title: 'Nej',
												isChecked: false,
												id: '-53539',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c74d0fea-6b11-4b10-a1a8-9a5988e739d1',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 56,
								},
								{
									type: 'FieldSection',
									title: 'Berätta mer',
									value: 'Vad annat än årstider intresserar dig? Berätta gärna mer för oss:',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {},
									guid: '1da075a6-8263-491a-bdd7-236b733f5461',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 64,
								},
								{
									type: 'FieldTextArea',
									title: 'Fler intressen',
									value: '',
									helpText:
										'Du kan skriva hur långt och hur mycket du vill.',
									sortIndex: 5,
									fieldOptions: {},
									guid: '89017f25-96ba-4457-953d-6e61639486a3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 65,
								},
							],
							id: 10,
						},
						{
							type: 'step',
							sortIndex: 4,
							title: 'Bilagor och datum',
							description:
								'Den här texten visas överst i ett steg. Det är valfritt.\n\nI det här steget visas funktionerna bifoga fil och välja datum.',
							fields: [
								{
									type: 'FieldFileUpload',
									title: 'Bifoga flera filer',
									value: '',
									helpText:
										'I den här rutan kan du bifoga upp till 10 filer. Minst en fil måste bifogas. Flera olika filtyper är tillåtna.',
									sortIndex: 1,
									fieldOptions: {
										allowMultiple: true,
										validation: [],
										fileTypeValidation: 'PdfAndWord',
									},
									guid: 'b4f310b4-f1d5-4128-af73-51707b2a8d9f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 57,
								},
								{
									type: 'FieldFileUpload',
									title: 'Bifoga en fil (alla typer)',
									value: '',
									helpText:
										'Den här rutan kan du bifoga en fil och den får bara vara av jpg-typ.',
									sortIndex: 2,
									fieldOptions: {
										allowMultiple: null,
										fileTypeValidation: '',
									},
									guid: '436bcd3a-9f2a-4617-b316-e1e67cdfa95b',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 58,
								},
								{
									type: 'FieldDatePicker',
									title: 'En bra dag',
									value: '',
									helpText:
										'Välj via kalenderfunktionen eller skriv ÅÅÅÅMMDD',
									sortIndex: 3,
									fieldOptions: {},
									guid: '2d5bad64-2c38-4865-bae6-7616b5a9f6bd',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 61,
								},
							],
							id: 11,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Flytta ut',
							id: 13,
						},
					],
					categories: [
						{
							title: 'Omsorg & hjälp',
							id: 14,
						},
					],
					pM3: {
						title: 'Färdtjänst',
						id: 1,
					},
					receiver: {
						title: 'Administration och innovation',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 13,
					},
					createdBy: 'kajsa.andersson@test.se',
					created: '2019-01-10T10:51:33.6544013',
					modifiedBy: 'kalle.andersson@test.se',
					modified: '2019-04-01T12:36:23.4140344',
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 1001,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '1026',
				attributes: {
					title: 'Anmäla lorem te ipsum dolor',
					description:
						'<p>I den h&auml;r e-tj&auml;nsten visas de funktioner som det nya verktyget f&ouml;r enkel dataf&aring;ngst har. Namn p&aring; f&auml;lt osv. kan &auml;ndras utifr&aring;n behov och &auml;ndringsbeslut fr&aring;n kommunikationsenheten. F&ouml;r att starta e-tj&auml;nsten tryck p&aring; &rdquo;Starta&rdquo;.</p>',
					status: 'Published',
					type: 'EService',
					hidden: false,
					hidePersonNumber: true,
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: false,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: false,
					},
					applyingForAnother: false,
					lifeSituations: [{ id: 99, title: 'Resa' }],
					comments: [
						{
							guid: '3c',
							text: 'Kommentar 2 en väldigt lång kommentar som visas på många ställen',
							timestamp: '2020-01-10T10:51:33.6544013',
							userEmail: 'kalle.andersson@test.se',
						},
						{
							guid: '3c',
							text: 'Kommentar 1 en väldigt lång kommentar som visas på många ställen  en väldigt lång kommentar som visas på många ställen  en väldigt lång kommentar som visas på många ställen',
							timestamp: '2020-01-04T10:51:33.6544013',
							userEmail: 'robert.andersson@test.se',
						},
					],
					path: 'VisningstjanstLorem',
					integrations: [
						{
							type: 'Sharepoint',
							options: [
								{
									key: 'title',
									value: 'Till SP - IT Test och utveckling',
									id: 112,
								},
								{
									key: 'siteTitle',
									value: 'IT test och utveckling',
									id: 113,
								},
								{
									key: 'userEmail',
									value: 'kajsa.andersson@test.se',
									id: 114,
								},
								{
									key: 'anonymizeTitle',
									value: 'false',
									id: 115,
								},
							],
							id: 3,
						},
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Mejl till Lena',
									id: 85,
								},
								{
									key: 'subject',
									value: 'Ny insickning av visningstjänsten',
									id: 86,
								},
								{
									key: 'attachFiles',
									value: 'false',
									id: 87,
								},
								{
									key: 'body',
									value: '<p>Dokumentet finns i underplats h&auml;r <a href="https://umea.sharepoint.com/sites/BasicUse" target="_blank" rel="noopener">Samlingsplats BasicUse</a></p>',
									id: 88,
								},
								{
									key: 'sender',
									value: 'noreply@test.se',
									id: 89,
								},
								{
									key: 'receiver',
									value: 'kajsa.andersson@test.se',
									id: 90,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [
										'89017f25-96ba-4457-953d-6e61639486c3',
										'89017f25-96ba-4457-953d-6e61639486d3',
									],
									id: 90,
								},
							],
							id: 11,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://www.any.com/start.html',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							sortIndex: 5,
							title: 'Intresse',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Välj intresseområde',
									value: '',
									helpText: 'Du kan välja ett alternativ',
									sortIndex: 1,
									fieldOptions: {
										items: [
											{
												title: 'Fågel',
												isChecked: false,
												id: '-93209',
											},
											{
												title: 'Fisk',
												isChecked: false,
												id: '-97208',
											},
											{
												title: 'Mittemellan',
												isChecked: false,
												id: '-47875',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c5fe918e-030f-444c-bee6-00c121889b2f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 54,
								},
								{
									type: 'FieldCheckBox',
									title: 'Vilka årstider tycker du om?',
									value: '',
									helpText:
										'Du kan välja ett eller flera alternativ',
									sortIndex: 3,
									fieldOptions: {
										items: [
											{
												title: 'Vinter',
												isChecked: false,
												id: '-37935',
											},
											{
												title: 'Vårvinter',
												isChecked: false,
												id: '-10155',
											},
											{
												title: 'Vår',
												isChecked: false,
												id: '-38553',
											},
											{
												title: 'Försommar',
												isChecked: false,
												id: '-90975',
											},
											{
												title: 'Högsommar',
												isChecked: false,
												id: '-74828',
											},
											{
												title: 'Sensommar',
												isChecked: false,
												id: '-78452',
											},
											{
												title: 'Höst',
												isChecked: false,
												id: '-96467',
											},
										],
									},
									guid: 'c99f4fc4-983b-4a85-8256-6412a8ab1d9e',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 55,
								},
								{
									type: 'FieldRadioButton',
									title: 'Är det din favorit?',
									value: '',
									helpText: 'Du kan välja ett alternativ',
									sortIndex: 2,
									fieldOptions: {
										items: [
											{
												title: 'Ja',
												isChecked: false,
												id: '-73762',
											},
											{
												title: 'Nej',
												isChecked: false,
												id: '-53539',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c74d0fea-6b11-4b10-a1a8-9a5988e739d1',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 56,
								},
								{
									type: 'FieldSection',
									title: 'Berätta mer',
									value: 'Vad annat än årstider intresserar dig? Berätta gärna mer för oss:',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {},
									guid: '1da075a6-8263-491a-bdd7-236b733f5461',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 64,
								},
								{
									type: 'FieldTextArea',
									title: 'Fler intressen',
									value: '',
									helpText:
										'Du kan skriva hur långt och hur mycket du vill.',
									sortIndex: 5,
									fieldOptions: {},
									guid: '89017f25-96ba-4457-953d-6e61639486a3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 65,
								},
								{
									type: 'FieldTextBox',
									title: 'Ett siffervärde',
									value: '',
									helpText: 'Här kan du bara skriva siffror.',
									sortIndex: 6,
									fieldOptions: {},
									guid: '89017f25-96ba-4457-953d-6e61639486b3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 66,
								},
								{
									type: 'FieldTextBox',
									title: 'Skicka mejl till 1',
									value: '',
									helpText:
										'Vill du ha ett mejl, ange din mejl-adress här.',
									sortIndex: 6,
									fieldOptions: {},
									guid: '89017f25-96ba-4457-953d-6e61639486c3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 95,
								},
								{
									type: 'FieldTextBox',
									title: 'Skicka mejl till 2',
									value: '',
									helpText:
										'Vill du ha ett mejl, ange din mejl-adress här.',
									sortIndex: 6,
									fieldOptions: {},
									guid: '89017f25-96ba-4457-953d-6e61639486d3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 97,
								},
								{
									type: 'FieldTextBox',
									title: 'Skicka mejl till 3',
									value: '',
									helpText:
										'Vill du ha ett mejl, ange din mejl-adress här.',
									sortIndex: 6,
									fieldOptions: {},
									guid: '33337f25-96ba-4457-953d-6e61639486e3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 98,
								},
							],
							id: 10,
						},
						{
							type: 'step',
							sortIndex: 6,
							title: 'Bilagor och datum',
							description:
								'Den här texten visas överst i ett steg. Det är valfritt.\n\nI det här steget visas funktionerna bifoga fil och välja datum.',
							fields: [
								{
									type: 'FieldFileUpload',
									title: 'Bifoga flera filer',
									value: '',
									helpText:
										'I den här rutan kan du bifoga upp till 10 filer. Minst en fil måste bifogas. Flera olika filtyper är tillåtna.',
									sortIndex: 1,
									fieldOptions: {
										allowMultiple: true,
										validation: [],
										fileTypeValidation: 'PdfAndWord',
									},
									guid: 'b4f310b4-f1d5-4128-af73-51707b2a8d9f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 57,
								},
								{
									type: 'FieldFileUpload',
									title: 'Bifoga en fil (alla typer)',
									value: '',
									helpText:
										'Den här rutan kan du bifoga en fil och den får bara vara av jpg-typ.',
									sortIndex: 2,
									fieldOptions: {
										allowMultiple: null,
										fileTypeValidation: '',
									},
									guid: '436bcd3a-9f2a-4617-b316-e1e67cdfa95b',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 58,
								},
								{
									type: 'FieldDatePicker',
									title: 'En bra dag',
									value: '',
									helpText:
										'Välj via kalenderfunktionen eller skriv ÅÅÅÅMMDD',
									sortIndex: 3,
									fieldOptions: {},
									guid: '2d5bad64-2c38-4865-bae6-7616b5a9f6bd',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 61,
								},
							],
							id: 11,
						},
					],
					displayRules: [],
					categories: [
						{
							title: 'Omsorg & hjälp',
							id: 14,
						},
					],
					pM3: {
						title: 'Färdtjänst',
						id: 1,
					},
					receiver: {
						title: 'Administration och innovation',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 13,
					},
					createdBy: 'kajsa.andersson@test.se',
					created: '2019-01-10T10:51:33.6544013',
					modifiedBy: 'kalle.andersson@test.se',
					modified: '2019-04-01T12:36:23.4140344',
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 1026,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '1029',
				attributes: {
					title: 'Intresseanmälan - visningstjänst - tabell',
					description:
						'<p>I den h&auml;r e-tj&auml;nsten visas de funktioner som det nya verktyget f&ouml;r enkel dataf&aring;ngst har. Namn p&aring; f&auml;lt osv. kan &auml;ndras utifr&aring;n behov och &auml;ndringsbeslut fr&aring;n kommunikationsenheten. F&ouml;r att starta e-tj&auml;nsten tryck p&aring; &rdquo;Starta&rdquo;.</p>',
					status: 'Published',
					type: 'EService',
					hidden: true,
					hidePersonNumber: false,
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: true,
						canApplyForAnother: true,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: false,
					},
					applyingForAnother: false,
					path: 'VisningstjanstTabell',
					comments: [
						{
							guid: '3',
							text: 'Kommentar 3 kort',
							timestamp: '2020-02-10T10:51:33.6544013',
							userEmail: 'Ida Andersson',
						},
						{
							guid: '2',
							text: 'Kommentar 2 en väldigt lång kommentar som visas på många ställen',
							timestamp: '2020-01-10T10:51:33.6544013',
							userEmail: 'kalle.andersson@test.se',
						},
						{
							guid: '1',
							text: 'Kommentar 1 en väldigt lång kommentar som visas på många ställen  en väldigt lång kommentar som visas på många ställen  en väldigt lång kommentar som visas på många ställen',
							timestamp: '2020-01-04T10:51:33.6544013',
							userEmail: 'robert.andersson@test.se',
						},
					],
					integrations: [
						{
							type: 'Sharepoint',
							options: [
								{
									key: 'title',
									value: 'Till SP - IT Test och utveckling',
									id: 112,
								},
								{
									key: 'siteTitle',
									value: 'IT test och utveckling',
									id: 113,
								},
								{
									key: 'userEmail',
									value: 'kajsa.andersson@test.se',
									id: 114,
								},
							],
							id: 3,
						},
						{
							type: 'AdvancedSharepoint',
							options: [
								{
									key: 'title',
									value: 'Till Avancerad Sharepoint - IT Test och utveckling',
									id: 212,
								},
								{
									key: 'siteTitle',
									value: 'Avancerad Sharepoint IT test och utveckling',
									id: 213,
								},
								{
									key: 'fieldList',
									value: '',
									data: [
										{
											fieldGuid:
												'c74d0fea-6b11-4b10-a1a8-9a5988e739d1',
											sharepointColumn: 'favorit',
										},
										{
											fieldGuid:
												'c99f4fc4-983b-4a85-8256-6412a8ab1d9e',
											sharepointColumn: 'arstider',
										},
									],
									id: 214,
								},
							],
							id: 4,
						},
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Mejl till Lena',
									id: 85,
								},
								{
									key: 'subject',
									value: 'Ny insickning av visningstjänsten',
									id: 86,
								},
								{
									key: 'attachFiles',
									value: 'false',
									id: 87,
								},
								{
									key: 'body',
									value: '<p>Dokumentet finns i underplats h&auml;r <a href="https://umea.sharepoint.com/sites/BasicUse" target="_blank" rel="noopener">Samlingsplats BasicUse</a></p>',
									id: 88,
								},
								{
									key: 'sender',
									value: 'noreply@test.se',
									id: 89,
								},
								{
									key: 'receiver',
									value: 'kajsa.andersson@test.se',
									id: 90,
								},
							],
							id: 11,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://www.any.com/start.html',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							sortIndex: 1,
							title: 'Intresse',
							description: '',
							fields: [
								{
									type: 'FieldSelectList',
									title: 'Välj intresseområde',
									value: '',
									helpText: 'Du kan välja ett alternativ',
									sortIndex: 1,
									fieldOptions: {
										items: [
											{
												title: 'Fågel',
												isChecked: false,
												id: '-93209',
											},
											{
												title: 'Fisk',
												isChecked: false,
												id: '-97208',
											},
											{
												title: 'Mittemellan',
												isChecked: false,
												id: '-47875',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c5fe918e-030f-444c-bee6-00c121889b2f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 54,
								},
								{
									type: 'FieldCheckBox',
									title: 'Vilka årstider tycker du om?',
									value: '',
									helpText:
										'Du kan välja ett eller flera alternativ',
									sortIndex: 3,
									fieldOptions: {
										items: [
											{
												title: 'Vinter',
												isChecked: false,
												id: '-37935',
											},
											{
												title: 'Vårvinter',
												isChecked: false,
												id: '-10155',
											},
											{
												title: 'Vår',
												isChecked: false,
												id: '-38553',
											},
											{
												title: 'Försommar',
												isChecked: false,
												id: '-90975',
											},
											{
												title: 'Högsommar',
												isChecked: false,
												id: '-74828',
											},
											{
												title: 'Sensommar',
												isChecked: false,
												id: '-78452',
											},
											{
												title: 'Höst',
												isChecked: false,
												id: '-96467',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c99f4fc4-983b-4a85-8256-6412a8ab1d9e',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 55,
								},
								{
									type: 'FieldRadioButton',
									title: 'Är det din favorit?',
									value: '',
									helpText: 'Du kan välja ett alternativ',
									sortIndex: 2,
									fieldOptions: {
										items: [
											{
												title: 'Ja',
												isChecked: false,
												id: '-73762',
											},
											{
												title: 'Nej',
												isChecked: false,
												id: '-53539',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c74d0fea-6b11-4b10-a1a8-9a5988e739d1',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 56,
								},
								{
									type: 'FieldSection',
									title: 'Tabell sektion',
									value: 'Här kommer en tabellsektion som har inget med tabellen att göra.',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {},
									guid: 'bdc0123a-a84c-434e-ae3e-ab522c9512c3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 64,
								},
								{
									type: 'FieldTable',
									title: 'Tabell för något',
									value: '',
									helpText: 'Detta är en tabell för något.',
									sortIndex: 5,
									fieldOptions: {},
									guid: 'c140ef72-1f50-42c2-b2d3-27cd399744b7',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 65,
								},
								{
									type: 'FieldTextBox',
									title: 'Förnamn, inne i tabell',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {
										tableGuid:
											'c140ef72-1f50-42c2-b2d3-27cd399744b7',
										columnWidth: 2,
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '941785ee-3965-4bd8-916b-95ec5c42bfb0',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 66,
								},
								{
									type: 'FieldCheckBox',
									title: 'Vilka årstider tycker du om?, inne i tabell',
									value: '',
									helpText:
										'Du kan välja ett eller flera alternativ',
									sortIndex: 3,
									fieldOptions: {
										tableGuid:
											'c140ef72-1f50-42c2-b2d3-27cd399744b7',
										columnWidth: 2,
										items: [
											{
												title: 'Vinter',
												isChecked: false,
												id: '-37935',
											},
											{
												title: 'Höst',
												isChecked: false,
												id: '-96467',
											},
										],
									},
									guid: '86ada99e-3089-4688-8f26-04809305d6e7',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 67,
								},
								{
									type: 'FieldSelectList',
									title: 'Välj intresseområde, inne i tabell',
									value: '',
									helpText: 'Du kan välja ett alternativ',
									sortIndex: 1,
									fieldOptions: {
										tableGuid:
											'c140ef72-1f50-42c2-b2d3-27cd399744b7',
										columnWidth: 2,
										items: [
											{
												title: 'Fågel',
												isChecked: false,
												id: '7d8027ba-88b0-49ac-bcad-2c40d06a70ed',
											},
											{
												title: 'Fisk',
												isChecked: false,
												id: 'ce2c44a0-723e-4702-ab82-ff77c1ac19ae',
											},
											{
												title: 'Mittemellan',
												isChecked: false,
												id: 'b1b3f711-90ac-46a5-9351-bf628e31f91a',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c5fe918e-030f-444c-bee6-00c121889b2f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 68,
								},
								{
									type: 'FieldRadioButton',
									title: 'Är det din favorit?, inne i tabell',
									value: '',
									helpText: 'Du kan välja ett alternativ',
									sortIndex: 2,
									fieldOptions: {
										tableGuid:
											'c140ef72-1f50-42c2-b2d3-27cd399744b7',
										columnWidth: 1,
										items: [
											{
												title: 'Ja',
												isChecked: false,
												id: '-73762',
											},
											{
												title: 'Nej',
												isChecked: false,
												id: '-53539',
											},
										],
									},
									guid: 'c74d0fea-6b11-4b10-a1a8-9a5988e739d1',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 69,
								},
								{
									type: 'FieldTextArea',
									title: 'Fler intressen, inne i tabell',
									value: '',
									helpText:
										'Du kan skriva hur långt och hur mycket du vill.',
									sortIndex: 9,
									fieldOptions: {
										tableGuid:
											'c140ef72-1f50-42c2-b2d3-27cd399744b7',
										columnWidth: 3,
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '89017f25-96ba-4457-953d-6e61639486a3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 70,
								},
								{
									type: 'FieldSection',
									title: 'Berätta mer',
									value: 'Vad annat än årstider intresserar dig? Berätta gärna mer för oss:',
									helpText: '',
									sortIndex: 8,
									fieldOptions: {},
									guid: '1da075a6-8263-491a-bdd7-236b733f5461',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 71,
								},
								{
									type: 'FieldTextArea',
									title: 'Fler intressen',
									value: '',
									helpText:
										'Du kan skriva hur långt och hur mycket du vill.',
									sortIndex: 9,
									fieldOptions: {},
									guid: '89017f25-96ba-4457-953d-6e61639486a3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 72,
								},
								{
									type: 'FieldTextBox',
									title: 'Ett siffervärde',
									value: '',
									helpText: 'Här kan du bara skriva siffror.',
									sortIndex: 10,
									fieldOptions: {
										validation: [
											{
												title: 'Endast siffror',
												type: 'numeric',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '89017f25-96ba-4457-953d-6e61639486b3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 73,
								},
							],
							id: 10,
						},
						{
							type: 'step',
							sortIndex: 2,
							title: 'Bilagor och datum',
							description:
								'Den här texten visas överst i ett steg. Det är valfritt.\n\nI det här steget visas funktionerna bifoga fil och välja datum.',
							fields: [
								{
									type: 'FieldFileUpload',
									title: 'Bifoga flera filer',
									value: '',
									helpText:
										'I den här rutan kan du bifoga upp till 10 filer. Minst en fil måste bifogas. Flera olika filtyper är tillåtna.',
									sortIndex: 1,
									fieldOptions: {
										allowMultiple: true,
										validation: [],
										fileTypeValidation: 'PdfAndWord',
									},
									guid: 'b4f310b4-f1d5-4128-af73-51707b2a8d9f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 57,
								},
								{
									type: 'FieldFileUpload',
									title: 'Bifoga en fil (alla typer)',
									value: '',
									helpText:
										'Den här rutan kan du bifoga en fil och den får bara vara av jpg-typ.',
									sortIndex: 2,
									fieldOptions: {
										allowMultiple: null,
										fileTypeValidation: '',
									},
									guid: '436bcd3a-9f2a-4617-b316-e1e67cdfa95b',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 58,
								},
								{
									type: 'FieldDatePicker',
									title: 'En bra dag',
									value: '',
									helpText:
										'Välj via kalenderfunktionen eller skriv ÅÅÅÅMMDD',
									sortIndex: 3,
									fieldOptions: {},
									guid: '2d5bad64-2c38-4865-bae6-7616b5a9f6bd',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 61,
								},
							],
							id: 11,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Årstider',
							id: 2,
						},
					],
					categories: [
						{
							title: 'Omsorg & hjälp',
							id: 14,
						},
					],
					pM3: {
						title: 'Färdtjänst',
						id: 1,
					},
					receiver: {
						title: 'Administration och innovation',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 13,
					},
					createdBy: 'kajsa.andersson@test.se',
					created: '2019-01-10T10:51:33.6544013',
					modifiedBy: 'kalle.andersson@test.se',
					modified: '2019-04-01T12:36:23.4140344',
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 1029,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '1045',
				attributes: {
					title: 'Hämta - data - till - tabell',
					description:
						'<p>I den h&auml;r e-tj&auml;nsten visas de funktioner som det nya verktyget f&ouml;r enkel dataf&aring;ngst har. Namn p&aring; f&auml;lt osv. kan &auml;ndras utifr&aring;n behov och &auml;ndringsbeslut fr&aring;n kommunikationsenheten. F&ouml;r att starta e-tj&auml;nsten tryck p&aring; &rdquo;Starta&rdquo;.</p>',
					status: 'Published',
					type: 'EService',
					hidden: false,
					hidePersonNumber: false,
					printFieldPersonnumber: false,
					simpleEservice: true,
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: true,
						canApplyForAnother: true,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: false,
					},
					applyingForAnother: false,
					path: 'HamtaDataTillTabell',
					comments: [
						{
							guid: '3',
							text: 'Kommentar 3 kort',
							timestamp: '2020-02-10T10:51:33.6544013',
							userEmail: 'Ida Andersson',
						},
					],
					integrations: [
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Mejl till Kajsa',
									id: 85,
								},
								{
									key: 'subject',
									value: 'Ny insickning av visningstjänsten',
									id: 86,
								},
								{
									key: 'attachFiles',
									value: 'false',
									id: 87,
								},
								{
									key: 'body',
									value: '<p>Dokumentet finns i underplats h&auml;r <a href="https://umea.sharepoint.com/sites/BasicUse" target="_blank" rel="noopener">Samlingsplats BasicUse</a></p>',
									id: 88,
								},
								{
									key: 'sender',
									value: 'noreply@test.se',
									id: 89,
								},
								{
									key: 'receiver',
									value: 'kajsa.andersson@test.se',
									id: 90,
								},
							],
							id: 11,
						},
						{
							type: 'OnPrem',
							options: [
								{
									key: 'title',
									value: 'Wifi',
								},
								{
									key: 'datasourcename',
									value: 'UserWifiConnections',
								},
							],
							id: 25,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://www.any.com/start.html',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							sortIndex: 1,
							title: 'Tabell',
							description: '',
							fields: [
								{
									type: 'FieldTable',
									title: 'Tabell för något',
									value: '',
									helpText: 'Detta är en tabell för något.',
									sortIndex: 1,
									fieldOptions: {
										minRows: 1,
										dataSource: {
											dataSourceName:
												'UserWifiConnections',
											options: {},
										},
										maxRows: 3,
									},
									guid: 'f66a4dd7-6de9-408d-b83e-2b38c091e51a',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 595,
								},
								{
									type: 'FieldTextBox',
									title: 'Namn',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										tableGuid:
											'f66a4dd7-6de9-408d-b83e-2b38c091e51a',
										dataSource: {
											dataSourceName:
												'UserWifiConnections',
											options: {
												itemProperty: 'Description',
											},
										},
									},
									guid: '5f8fcb64-7186-443c-b584-1fdd288a8c41',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 596,
								},
								{
									type: 'FieldTextBox',
									title: 'Adress',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										tableGuid:
											'f66a4dd7-6de9-408d-b83e-2b38c091e51a',
										dataSource: {
											dataSourceName:
												'UserWifiConnections',
											options: {
												itemProperty: 'Address',
											},
										},
										validation: [
											{
												title: 'Korrekt Mac-adress',
												type: 'macAddress',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '67ae0970-2aec-4a9c-b6fa-033dab072c6a',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 597,
								},
								{
									type: 'FieldTextBox',
									title: 'Lösenord',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										tableGuid:
											'f66a4dd7-6de9-408d-b83e-2b38c091e51a',
										dataSource: {
											dataSourceName:
												'UserWifiConnections',
											options: {
												itemProperty: 'Password',
											},
										},
										generatedPassword: {
											autoGeneratedPassword: true,
											passwordLength: '10',
											selectedPasswordSpecialCharacters: {
												id: 'no',
												isChecked: true,
												title: 'Nej',
												value: 'false',
											},
										},
									},
									guid: '06aa08f2-063e-49fc-80e5-c44a4c77b1c5',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 598,
								},
							],
							id: 75,
						},
					],
					displayRules: [],
					pM3: {
						title: 'Färdtjänst',
						id: 1,
					},
					receiver: {
						title: 'Administration och innovation',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 13,
					},
					lifeSituations: [
						{
							title: 'Flytta in',
							id: 12,
						},
					],
					categories: [
						{
							title: 'Bygga & Bo',
							id: 1,
						},
					],
					createdBy: 'kajsa.andersson@test.se',
					created: '2020-01-10T10:51:33.6544013',
					modifiedBy: 'kalle.andersson@test.se',
					modified: '2020-04-01T12:36:23.4140344',
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 1045,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '1091',
				attributes: {
					title: 'Ansök om färdtjänst',
					description:
						'<p>Kort text som beskriver vad e-tj&auml;nsten &auml;r till f&ouml;r</p>',
					status: 'Published',
					type: 'EService',
					hidden: false,
					hidePersonNumber: false,
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: false,
						canApplyForAnother: true,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: false,
					},
					applyingForAnother: false,
					path: 'fraga-stadsarkivet',
					comments: [
						{
							guid: '3ss',
							text: 'Kommentar 3 kort',
							timestamp: '2020-02-10T10:51:33.6544013',
							userEmail: 'ida.andersson@test.se',
						},
						{
							guid: '3ss',
							text: 'Kommentar 2 en väldigt lång kommentar som visas på många ställen',
							timestamp: '2020-01-10T10:51:33.6544013',
							userEmail: 'kalle.andersson@test.se',
						},
						{
							guid: '3ss',
							text: 'Kommentar 1 en väldigt lång kommentar som visas på många ställen  en väldigt lång kommentar som visas på många ställen  en väldigt lång kommentar som visas på många ställen',
							timestamp: '2020-01-04T10:51:33.6544013',
							userEmail: 'robert.andersson@test.se',
						},
					],
					integrations: [],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Styrelsen',
								url: 'http://www.test.se',
								id: 12,
							},
						],
					},
					steps: [
						{
							type: 'step',
							sortIndex: 7,
							title: 'Fråga eller beställning',
							description: '',
							fields: [
								{
									type: 'FieldTextBox',
									title: 'Endast Read only',
									value: 'Denna data är inlagd från annat håll och kan inte ändras',
									helpText:
										'Ska vara ett fält som är endast read only',
									sortIndex: 1,
									fieldOptions: {
										readOnly: true,
										dataSource: {
											dataSourceName: 'WorkDepartment',
											options: {
												itemProperty: 'title',
											},
										},
									},
									guid: '89017f25-96ba-4457-953d-6e61639487b3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1,
								},
								{
									type: 'FieldTextBox',
									title: 'Som inte är Read only',
									value: '',
									helpText: 'Skriv in',
									sortIndex: 2,
									fieldOptions: {
										readOnly: false,
									},
									guid: '89017f25-96ba-4457-953d-6e61639481b3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2,
								},
								{
									type: 'FieldTextArea',
									title: 'Frågeställning eller beställning',
									value: '',
									helpText:
										'Beskriv din frågeställning eller beställning så utförligt som möjligt',
									sortIndex: 3,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '6d4c674d-0923-4849-9498-5244d4eab86d',
									displayRuleGuids: [],
									displayRuleAnother: true,
									displayRuleMultipleLegitimation: false,
									id: 5,
								},
								{
									type: 'FieldFileUpload',
									title: 'Beskrivande dokument',
									value: '',
									helpText:
										'Du kan bifoga ett beskrivande dokument för fråga eller beställning',
									sortIndex: 4,
									fieldOptions: {
										acceptedFileTypes:
											'image/jpg, image/jpeg, image/png , application/pdf',
										validation: [],
									},
									guid: '201fc7dd-ffaf-44f7-9efc-17e7e6ca67e7',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 6,
								},
								{
									type: 'FieldSection',
									title: 'Svarsform',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {},
									guid: '126fe7ec-3f3c-4b53-9af7-8d8fa3cd4103',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 7,
								},
								{
									type: 'FieldCheckBox',
									title: 'Svar önskas via',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {
										items: [
											{
												title: 'Telefon',
												isChecked: false,
												id: '-92099',
											},
											{
												title: 'Mejl',
												isChecked: false,
												id: '-60886',
											},
											{
												title: 'Brev',
												isChecked: false,
												id: '-54345',
											},
											{
												title: 'Internpost (endast för kommunala verksamheter)',
												isChecked: false,
												id: '-6140',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '991d55b4-79f8-4382-be02-bf05db326f01',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 8,
								},
								{
									type: 'FieldSection',
									title: 'Vilken kategori stämmer bäst in på dig?',
									value: '<p>F&ouml;r v&aring;r statistik ber vi dig ange vilken eller vilka av kategorierna som st&auml;mmer b&auml;st in p&aring; dig</p>',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {},
									guid: '58a69711-a172-4aec-b506-829e7d908b00',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 9,
								},
								{
									type: 'FieldCheckBox',
									title: 'Kategori',
									value: '',
									helpText: '',
									sortIndex: 8,
									fieldOptions: {
										items: [
											{
												title: 'Forskare eller student vid universitet eller skola',
												isChecked: false,
												id: '-85741',
											},
											{
												title: 'Kommunalt verksamhetsområde',
												isChecked: false,
												id: '-75611',
											},
											{
												title: 'Kommunalt bolag',
												isChecked: false,
												id: '-88366',
											},
											{
												title: 'Övrigt',
												isChecked: false,
												id: '-14570',
											},
										],
										validation: [],
									},
									guid: 'd225a869-6341-42d2-be62-2ef4f125845e',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 10,
								},
							],
							id: 6,
						},
					],
					displayRules: [],
					pM3: {
						title: 'Omsorg',
						id: 4,
					},
					receiver: {
						title: 'Styrelsen',
						url: 'test',
						id: 12,
					},
					lifeSituations: [
						{
							title: 'Flytta in',
							id: 12,
						},
					],
					categories: [
						{
							title: 'Bygga & Bo',
							id: 1,
						},
					],
					createdBy: 'kajsa.andersson@test.se',
					created: '2019-01-17T09:15:27.2592904',
					modifiedBy: 'kajsa.andersson@test.se',
					modified: '2019-03-18T15:51:59.5817556',
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 1091,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '2478',
				attributes: {
					title: 'Barn och utbildning',
					description: '<p>Test</p>',
					status: 'Published',
					type: 'LinkExternal',
					linkUrl:
						'https://umea.se/barnochutbildning.4.1c16b00a1742340e02ea20.html',
					path: 'barn-och-utbildning',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 951,
								},
							],
							id: 166,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Styrelsen',
								url: 'https://www.any.com/start.html',
								id: 12,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg 1',
							description: '',
							fields: [],
							sortIndex: 0,
							id: 118,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Jobb',
							id: 14,
						},
					],
					categories: [
						{
							title: 'Jobb & företagande',
							id: 16,
						},
					],
					pM3: {
						title: 'Arbetsliv',
						id: 5,
					},
					receiver: {
						title: 'Administration och innovation',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 13,
					},
					createdBy: 'anna.anka@test.se',
					created: '2020-05-20T11:54:16.4905697',
					modifiedBy: 'anna.anka@test.se',
					modified: '2020-05-20T12:10:24.1764171',
					dateSchedule: {
						from: '2020-05-20T12:07:50.6831708Z',
						to: '2020-05-20T12:07:50.6831732Z',
						active: false,
						formId: 2478,
						id: 50,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 2478,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: true,
						contactPaths: [1, 2],
						id: 55,
					},
					hidden: false,
					hidePersonNumber: false,
					printFieldPersonnumber: false,
					simpleEservice: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 2478,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '7478',
				attributes: {
					title: 'Företag, lägg till sommarjobb',
					description: '<p>Test</p>',
					status: 'Published',
					type: 'EService',
					path: 'foretag-lagg-till-sommarjobb',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 951,
								},
							],
							id: 166,
						},
						{
							type: 'OnPrem',
							options: [
								{
									key: 'title',
									value: 'OnPrem koppling',
									data: {},
									id: 1154,
								},
								{
									key: 'datasourcename',
									value: 'arbetsplats',
									data: {},
									id: 1155,
								},
							],
							id: 202,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Styrelsen',
								url: 'https://www.any.com/start.html',
								id: 12,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg 1',
							description: '',
							fields: [
								{
									type: 'FieldTextSearchBox',
									title: 'Verksamhetskod',
									value: '',
									helpText: 'Verksamhetens kod',
									sortIndex: 1,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty: 'arbetsplatsKod',
											},
										},
										buttonText: 'Ska vara test',
									},
									guid: '89017f25-96ba-4457-953d-6e6163948455',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									displayRuleSearchResponse: true,
									id: 22,
								},
							],
							sortIndex: 0,
							id: 118,
						},
						{
							type: 'step',
							title: 'Arbetsplats/förening',
							description: '',
							fields: [
								{
									type: 'FieldSection',
									title: 'Arbetsplats/Förening',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {},
									guid: '36a2754e-f86f-4cd2-8b5c-1e2c7f352181',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 833,
								},
								{
									type: 'FieldTextBox',
									title: 'Namn',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										readOnly: true,
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty: 'arbetsplatsNamn',
											},
										},
									},
									guid: '9b29d67f-3351-42a2-a482-fda7239afcf5',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 852,
								},
								{
									type: 'FieldSection',
									title: 'Adressuppgifter',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {},
									guid: 'ae5c7ff3-4fda-4f95-b495-9419038d4034',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 851,
								},
								{
									type: 'FieldTextBox',
									title: 'C/o-adress',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty: 'arbetsplatsCo',
											},
										},
									},
									guid: '33ce3a4a-b2a1-4482-bd0c-5f93c1b3e94c',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 850,
								},
								{
									type: 'FieldTextBox',
									title: 'Gatuadress',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsGatuadress',
											},
										},
									},
									guid: '5f8a35ed-d7a4-49ad-92f6-9a22216c5596',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 849,
								},
								{
									type: 'FieldTextBox',
									title: 'Postnr',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsPostnr',
											},
										},
									},
									guid: '6b0e148d-5fc7-44c7-bcb3-8c8b09241c7f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 848,
								},
								{
									type: 'FieldTextBox',
									title: 'Ort',
									value: '',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsPostadress',
											},
										},
									},
									guid: '02759196-7e7b-460d-bc9d-133286acae7b',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 847,
								},
								{
									type: 'FieldSelectList',
									title: 'Stadsdel/by',
									value: '',
									helpText: '',
									sortIndex: 8,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
										dataSource: {
											dataSourceName: 'Stadsdelar',
											options: {
												itemProperty:
													'stadsdelKlartext',
											},
										},
									},
									guid: '20959e87-1dc6-45bd-88b6-2db6a3fb51ab',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 846,
								},
								{
									type: 'FieldSection',
									title: 'Uppgiftlämnare',
									value: '',
									helpText: '',
									sortIndex: 9,
									fieldOptions: {},
									guid: '3cca7cd6-ce5c-46e0-8e30-f35ff393eb62',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 845,
								},
								{
									type: 'FieldTextBox',
									title: 'Namn',
									value: '',
									helpText: '',
									sortIndex: 10,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsUppglaemnareNamn',
											},
										},
									},
									guid: '2ed1586a-ca3e-4169-91e3-abf14fc3f62f',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 844,
								},
								{
									type: 'FieldTextBox',
									title: 'Telefonnummer',
									value: '',
									helpText: '',
									sortIndex: 11,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsUppglaemnareTelefonnr',
											},
										},
									},
									guid: '64227bac-e472-4400-b35e-bb681af9f4a4',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 843,
								},
								{
									type: 'FieldTextBox',
									title: 'Epostadress',
									value: '',
									helpText: '',
									sortIndex: 12,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsUppglaemnareEpostadress',
											},
										},
									},
									guid: 'c1e51469-4f48-4179-aa55-35039dcf9cca',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 842,
								},
								{
									type: 'FieldSection',
									title: 'Utskick - Adressuppgifter',
									value: '<p>Ange utskicksadress om utskick ska g&ouml;ras till annna adress &auml;n arbetsplatsens.</p>',
									helpText: '',
									sortIndex: 13,
									fieldOptions: {},
									guid: 'bf0c2d08-97d5-4dec-800e-2232c4d352c5',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 841,
								},
								{
									type: 'FieldTextBox',
									title: 'Namn',
									value: '',
									helpText: '',
									sortIndex: 14,
									fieldOptions: {
										validation: [],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsUtskickNamn',
											},
										},
									},
									guid: 'a8dfe5c6-0bba-4d28-955c-8df392a823f3',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 840,
								},
								{
									type: 'FieldTextBox',
									title: 'Epost',
									value: '',
									helpText: '',
									sortIndex: 15,
									fieldOptions: {
										validation: [],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsUtskickEpostadress',
											},
										},
									},
									guid: '641ac341-4d98-4cd3-b36e-312d9175e745',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 839,
								},
								{
									type: 'FieldTextBox',
									title: 'Gatuadress',
									value: '',
									helpText: '',
									sortIndex: 16,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsUtskickGatuadress',
											},
										},
									},
									guid: '2910a114-9e31-4b34-abac-9623877d9e2d',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 838,
								},
								{
									type: 'FieldTextBox',
									title: 'Postnr',
									value: '',
									helpText: '',
									sortIndex: 17,
									fieldOptions: {
										validation: [],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsUtskickPostnr',
											},
										},
									},
									guid: 'ed68ef5e-7b28-468e-a2f9-05e8cff5609c',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 837,
								},
								{
									type: 'FieldTextBox',
									title: 'Ort',
									value: '',
									helpText: '',
									sortIndex: 18,
									fieldOptions: {
										validation: [],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsUtskickPostadress',
											},
										},
									},
									guid: '66aba8c1-dc02-4c4e-8580-65324c149894',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 836,
								},
								{
									type: 'FieldSection',
									title: 'Kontaktuppgifter',
									value: '<p>Ange kontaktuppgifter om det inte &auml;r samma som uppgiftl&auml;mnare.</p>',
									helpText: '',
									sortIndex: 19,
									fieldOptions: {},
									guid: 'ee6f8b74-8fac-4b48-ac85-c46cd8f06f28',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 835,
								},
								{
									type: 'FieldTextBox',
									title: 'Kontaktperson',
									value: '',
									helpText: '',
									sortIndex: 20,
									fieldOptions: {
										validation: [],
										dataSource: {
											dataSourceName: 'Arbetsplats',
											options: {
												itemProperty:
													'arbetsplatsKontaktperson',
											},
										},
									},
									guid: 'a110fe12-e492-402e-9d58-2479f66f9f41',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 834,
								},
								{
									type: 'FieldTextBox',
									title: 'Telefonnummer',
									value: '',
									helpText: '',
									sortIndex: 21,
									fieldOptions: { validation: [] },
									guid: '5d8c36c9-25c4-4a70-92c9-100d1bea1027',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 853,
								},
								{
									type: 'FieldTextBox',
									title: 'Epost',
									value: '',
									helpText: '',
									sortIndex: 22,
									fieldOptions: { validation: [] },
									guid: 'a7230c82-5c9f-4ff6-9ed2-a764aa438e5d',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 854,
								},
							],
							sortIndex: 1,
							id: 151,
						},
						{
							type: 'step',
							title: 'Arbetstillfällen',
							description: '',
							fields: [
								{
									type: 'FieldTable',
									title: 'Uppgifter om arbetstillfället',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'AktuellaPerioder',
											options: {
												itemProperty: 'description',
											},
										},
										maxRows: 3,
										minRows: 1,
										tableRows: [
											{
												guid: '73014186-ed6f-4ca3-a2e7-0f47abec1ba3',
												columns: [
													{
														fieldGuid:
															'9fe15328-dfed-45d5-9f2c-333e6bbf3a48',
														value: '',
														isItem: false,
													},
													{
														fieldGuid:
															'950a7b2a-3134-4426-8dba-1f9ebd99412b',
														value: '',
														isItem: false,
													},
													{
														fieldGuid:
															'36919e1f-8234-4625-8dc7-378d104ecce8',
														value: '',
														isItem: false,
													},
												],
											},
											{
												guid: '40a9f488-8443-4fef-82dd-c0c5b7441d93',
												columns: [
													{
														fieldGuid:
															'9fe15328-dfed-45d5-9f2c-333e6bbf3a48',
														value: '',
														isItem: false,
													},
													{
														fieldGuid:
															'950a7b2a-3134-4426-8dba-1f9ebd99412b',
														value: '',
														isItem: false,
													},
													{
														fieldGuid:
															'36919e1f-8234-4625-8dc7-378d104ecce8',
														value: '',
														isItem: false,
													},
												],
											},
											{
												guid: 'f0b40d0b-c747-425b-b646-d2c2fd43299c',
												columns: [
													{
														fieldGuid:
															'9fe15328-dfed-45d5-9f2c-333e6bbf3a48',
														value: '',
														isItem: false,
													},
													{
														fieldGuid:
															'950a7b2a-3134-4426-8dba-1f9ebd99412b',
														value: '',
														isItem: false,
													},
													{
														fieldGuid:
															'36919e1f-8234-4625-8dc7-378d104ecce8',
														value: '',
														isItem: false,
													},
												],
											},
										],
									},
									guid: '59ef5f7a-ec66-4c65-a2dd-31b83a83a8a5',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 855,
								},
								{
									type: 'FieldTextBox',
									title: 'Anställningsperiod',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										tableGuid:
											'59ef5f7a-ec66-4c65-a2dd-31b83a83a8a5',
										columnWidth: 3,
										dataSource: {
											dataSourceName: 'AktuellaPerioder',
											options: {
												itemProperty: 'periodKlartext',
											},
										},
									},
									guid: '9fe15328-dfed-45d5-9f2c-333e6bbf3a48',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 856,
								},
								{
									type: 'FieldTextBox',
									title: 'Anställningsdatum (fr o m - t o m)',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										tableGuid:
											'59ef5f7a-ec66-4c65-a2dd-31b83a83a8a5',
										columnWidth: 4,
										dataSource: {
											dataSourceName: 'AktuellaPerioder',
											options: {
												itemProperty: 'periodFomTom',
											},
										},
									},
									guid: '950a7b2a-3134-4426-8dba-1f9ebd99412b',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 857,
								},
								{
									type: 'FieldTextBox',
									title: 'Antal ungdomar',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										tableGuid:
											'59ef5f7a-ec66-4c65-a2dd-31b83a83a8a5',
										columnWidth: 3,
										dataSource: {
											dataSourceName: 'AktuellaPerioder',
											options: {
												itemProperty: 'description',
											},
										},
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
											{
												title: 'Endast siffror',
												type: 'numeric',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '36919e1f-8234-4625-8dc7-378d104ecce8',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 858,
								},
								{
									type: 'FieldTextArea',
									title: 'Arbetsuppgifter(precisera)',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleBeskrivning',
											},
										},
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '4aac5108-c9c3-4650-830f-49b56377fe0a',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 859,
								},
								{
									type: 'FieldTextArea',
									title: 'Arbetstider/arbetsschema',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleArbetstid',
											},
										},
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'e9399caf-abea-4582-885a-08744a4e3471',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 860,
								},
								{
									type: 'FieldTextArea',
									title: 'Mötesplats första arbetsdagen',
									value: '',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleMootesplats',
											},
										},
									},
									guid: 'b197cc39-da71-4890-8cbc-cc84ea7948d4',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 861,
								},
								{
									type: 'FieldTextBox',
									title: 'Mötestid första arbetsdagen',
									value: '',
									helpText: '',
									sortIndex: 8,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleMootestid',
											},
										},
									},
									guid: '20e5f733-5d2f-44b3-a654-954a423fa032',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 862,
								},
							],
							sortIndex: 2,
							id: 153,
						},
						{
							type: 'step',
							title: 'Handledning',
							description: '',
							fields: [
								{
									type: 'FieldSection',
									title: 'Handledare/Ansvarig för lönerapportering',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {},
									guid: 'da554f55-5fba-4774-b48d-5a2060ca5e96',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 868,
								},
								{
									type: 'FieldTextBox',
									title: 'Namn',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleHandledare1',
											},
										},
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
											{
												title: 'Max 50 tecken (databas liten)',
												type: 'charMaxSize50',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '75737d73-0167-4c65-9b68-6918f0233c51',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 867,
								},
								{
									type: 'FieldTextBox',
									title: 'Direkttelefonnummer',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleTelefonnr1',
											},
										},
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c64a061f-2091-4c0d-82cd-4e65f3340290',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 866,
								},
								{
									type: 'FieldTextBox',
									title: 'Epostadress',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleEpostadress1',
											},
										},
									},
									guid: '0d9d40ce-948b-436c-9684-309973dca39e',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 865,
								},
								{
									type: 'FieldTextBox',
									title: 'Namn',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleHandledare2',
											},
										},
										validation: [
											{
												title: 'Max 50 tecken (databas liten)',
												type: 'charMaxSize50',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '26b7efa6-3725-4ced-b484-a8c70beab180',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 863,
								},
								{
									type: 'FieldTextBox',
									title: 'Direkttelefonnummer',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleTelefonnr2',
											},
										},
									},
									guid: '420a5509-1e1c-44ca-aa69-d458e42dec56',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 869,
								},
								{
									type: 'FieldTextBox',
									title: 'Epostadress',
									value: '',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleEpostadress2',
											},
										},
									},
									guid: 'ce54c164-5cb4-4bcf-99be-7e9c5906a007',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 870,
								},
								{
									type: 'FieldTextArea',
									title: 'Övrigt',
									value: '',
									helpText: 'Övriga upplysningar',
									sortIndex: 8,
									fieldOptions: {
										dataSource: {
											dataSourceName: 'Arbetstillfaelle',
											options: {
												itemProperty:
													'arbetstillfaelleAnteckningar',
											},
										},
										validation: [
											{
												title: 'Max 5000 tecken (databas stor)',
												type: 'charMaxSize5000',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '97510ec1-f205-4db6-8d94-3eb090bd2e08',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 864,
								},
							],
							sortIndex: 3,
							id: 152,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Jobb',
							id: 14,
						},
					],
					categories: [
						{
							title: 'Jobb & företagande',
							id: 16,
						},
					],
					pM3: {
						title: 'Arbetsliv',
						id: 5,
					},
					receiver: {
						title: 'Jobbet',
						url: 'https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html',
						id: 19,
					},
					createdBy: 'anna.anka@test.se',
					created: '2020-05-20T11:54:16.4905697',
					modifiedBy: 'anna.anka@test.se',
					modified: '2020-05-20T12:10:24.1764171',
					dateSchedule: {
						from: '2020-05-20T12:07:50.6831708Z',
						to: '2020-05-20T12:07:50.6831732Z',
						active: false,
						formId: 7478,
						id: 50,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 7478,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: true,
						multipleLegitimation: true,
						contactPaths: [1, 2],
						id: 55,
					},
					hidden: false,
					hidePersonNumber: false,
					printFieldPersonnumber: false,
					simpleEservice: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 7478,
		},
		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '7785',
				attributes: {
					title: 'TextFieldBox test',
					description: '<p>Placering f&ouml;r ungdom</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'text-field-box-test',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 1566,
								},
							],
							id: 246,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								title: 'Tekniska',
								url: 'https://test.se/',
								id: 1,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Test Steg 1',
							description:
								'När du skickar in ditt svar elektroniskt, får du en kvittens i webbläsaren som säger att ditt svar har kommit in till kommunen.\n\nDet är först när du har fått kvittensen som ditt svar har kommit in till kommunen.',
							fields: [
								{
									type: 'FieldTextBox',
									title: 'Du är erbjuden ferieprao hos:',
									value: 'Svensk markservice.',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										readOnly: true,
										dataSource: {
											dataSourceName: 'Placering',
											options: { itemProperty: 'Namn' },
										},
									},
									guid: '20a61224-b91c-4d74-8c33-93de031125c5',
									displayRuleGuids: [],
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1346,
								},
							],
							sortIndex: 0,
							id: 203,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Jobb',
							id: 14,
						},
					],
					categories: [
						{
							title: 'Jobb & företagande',
							id: 16,
						},
					],
					pM3: {
						title: 'Arbetsliv',
						id: 5,
					},
					receiver: {
						title: 'Jobbet',
						url: 'https://www.any.com/start.html',
						id: 19,
					},
					createdBy: 'test@test.se',
					created: '2021-03-15T10:40:03.386574',
					modifiedBy: 'test@test.se',
					modified: '2021-03-17T09:49:59.2841082',
					dateSchedule: {
						from: '2021-03-15T10:42:29.1816948Z',
						to: '2021-03-15T10:42:29.1816977Z',
						active: false,
						formId: 7785,
						id: 90,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: false,
						emailMandatory: false,
						phoneNumberMandatory: false,
						formId: 7785,
						canApplyForAnother: false,
						authClient: ['Publik'],
						showUserContactInformation: false,
						multipleLegitimation: false,
						contactPaths: [],
						id: 7785,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					printFieldPersonnumber: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				type: 'form',
			},
			errors: [],
			id: 7785,
		},
		{
			links: { self: 'http://localhost:3000' },
			data: {
				id: '168',
				attributes: {
					title: 'Test Input',
					description:
						'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam consequat mollis lobortis. Nam venenatis rhoncus luctus. Praesent scelerisque tempus ligula, a tincidunt lorem placerat eget. Proin rhoncus magna lacus, sed tristique dui sodales quis. Cras id tortor ut lorem molestie rhoncus sit amet id elit. Praesent ultricies sodales risus, vel venenatis nisi scelerisque imperdiet. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque et blandit felis. Phasellus tincidunt rhoncus dui sit amet hendrerit. Quisque tristique mollis dictum. Integer ac rutrum ipsum, sit amet fermentum nulla. Praesent dapibus pulvinar lacus, non consectetur quam finibus eu. Praesent suscipit metus sit amet interdum vestibulum.</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'form-2022-05-30T09:30:21759Z',
					integrations: [
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Mail till gustav',
									data: {},
									id: 2277,
								},
								{
									key: 'subject',
									value: 'test e-tjänst input',
									data: {},
									id: 2278,
								},
								{
									key: 'attachFiles',
									value: 'true',
									data: {},
									id: 2279,
								},
								{ key: 'body', value: '', data: {}, id: 2280 },
								{
									key: 'sender',
									value: 'noreply.e-service@services.umea.se',
									data: {},
									id: 2281,
								},
								{
									key: 'receiver',
									value: 'test.testsson@test.se',
									data: {},
									id: 2282,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [],
									id: 2283,
								},
							],
							id: 387,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								adminTitle: 'Johan',
								title: 'Johan',
								url: 'http://www.google.se',
								id: 6,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Test steg 1',
							description: 'Detta är ett test.',
							fields: [
								{
									type: 'FieldTextBox',
									title: 'Ange en text',
									value: 'bara läsa',
									helpText: '(hjälptext)',
									sortIndex: 2,
									fieldOptions: {
										validation: [],
										readOnly: true,
									},
									guid: '972d6ea0-8a48-4b31-92d3-20d68936d115',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1932,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält 2',
									value: '',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {},
									guid: '8666b1c1-42ac-4a30-a148-03414ef068c3',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1951,
								},
								{
									type: 'FieldRadioButton',
									title: 'Favoritdessert? (obligatorisk)',
									value: '',
									helpText: 'detta är en hjäptext',
									sortIndex: 6,
									fieldOptions: {
										items: [
											{
												title: 'Glass',
												isChecked: false,
												id: 'dbe2f34f-6cfb-49a4-9fad-f31759c76a57',
											},
											{
												title: 'Tårta',
												isChecked: false,
												id: 'a05f8099-f29b-40ea-aab4-e4e6cb89bf05',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '51d3984f-99b1-4fa1-8bd8-70bc49d086fc',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1970,
								},
								{
									type: 'FieldPersonalNumber',
									title: 'Ange ditt personnummer',
									value: '',
									helpText: '',
									sortIndex: 8,
									fieldOptions: {},
									guid: 'cce84a8f-1109-4f97-9a2f-54bb48925142',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1972,
								},
								{
									type: 'FieldDatePicker',
									title: 'Välj ett datum',
									value: '',
									helpText: 'Välj ett valfritt datum',
									sortIndex: 1,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'd5f275e5-9e9d-4efc-9076-29359bba9b65',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1973,
								},
								{
									type: 'FieldTextBox',
									title: 'Textrad med persnr validering',
									value: '',
									helpText: '',
									sortIndex: 9,
									fieldOptions: {
										validation: [
											{
												title: 'Korrekt personnummer',
												type: 'validPersNumber',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '28d00f29-55f7-433c-9706-505b8ec33297',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1998,
								},
								{
									type: 'FieldTextBox',
									title: 'Ditt lösenord',
									value: '',
									helpText: 'Detta är en hjälptext',
									sortIndex: 5,
									fieldOptions: {
										generatedPassword: {
											autoGeneratedPassword: false,
											passwordLength: '10',
											selectedPasswordSpecialCharacters: {
												id: 'no',
												title: 'Nej',
												value: 'false',
												isChecked: true,
											},
										},
										readOnly: false,
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '3a41a387-4671-439d-a637-87ceca079489',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2045,
								},
								{
									type: 'FieldTextBox',
									title: 'Sista textraden',
									value: '',
									helpText: '',
									sortIndex: 10,
									fieldOptions: {},
									guid: '83ebb1fb-c735-41ab-b92f-a5e571cdd838',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2048,
								},
								{
									type: 'FieldSelectList',
									title: 'Rulllistan',
									value: '',
									helpText: 'help text',
									sortIndex: 3,
									fieldOptions: {
										items: [
											{
												title: 'Ja',
												isChecked: false,
												id: '0dac2138-a3c0-4f5f-966b-95b21c733829',
											},
											{
												title: 'Nej',
												isChecked: false,
												id: '089e1485-50b5-4898-b422-6e056d5b8435',
											},
											{
												title: 'Kanske',
												isChecked: false,
												id: '4e4fc908-ffd3-47f3-b92d-ad44783be157',
											},
											{
												title: 'Vill ej svara',
												isChecked: false,
												id: 'ee9c0a44-ba64-4b8b-b699-512481dc8dcf',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '36369a1c-b902-485f-807a-37d871e91063',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2095,
								},
								{
									type: 'FieldSelectSearchList',
									title: 'Söklista',
									value: '',
									helpText: 'Dis is helptext',
									sortIndex: 11,
									fieldOptions: {
										buttonText: 'SÖK',
										searchDataSource: {
											dataSourceName:
												'Fastighetsbeteckning',
											options: {
												itemProperty: 'Value',
												inPutDataSourceNames: [
													'LegalOwners',
													'PropertyAreas',
												],
											},
										},
									},
									guid: '299ffe49-3c2b-4cbe-a39a-cc7f80f67495',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2113,
								},
								{
									type: 'FieldCheckBox',
									title: 'Checklistan',
									value: '',
									helpText: 'detta är en hjälptext',
									sortIndex: 12,
									fieldOptions: {
										items: [
											{
												title: 'A 1',
												isChecked: false,
												id: 'd3dadd8a-a846-4788-9f71-abb3a0ffec61',
											},
											{
												title: 'A 2',
												isChecked: false,
												id: '5c984376-2d5f-4e3a-9586-1b516b6d2285',
											},
											{
												title: 'A 3',
												isChecked: false,
												id: '672c07be-4e89-4de4-b9ab-cf9750276b04',
											},
										],
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '5e81a32a-afc0-42d8-a391-99a5c12b8fda',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2114,
								},
								{
									type: 'FieldTable',
									title: 'Tabellen',
									value: '',
									helpText: '',
									sortIndex: 13,
									fieldOptions: {
										minRows: '2',
										maxRows: '5',
									},
									guid: 'e9f6bea2-abb8-45c5-a2c5-feda2fa8e184',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2115,
								},
								{
									type: 'FieldTextBox',
									title: 'Val 1',
									value: '',
									helpText: '',
									sortIndex: 14,
									fieldOptions: {
										tableGuid:
											'e9f6bea2-abb8-45c5-a2c5-feda2fa8e184',
										columnWidth: 3,
									},
									guid: '515748c3-1bbd-4597-b276-d1d3125c07c1',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2116,
								},
								{
									type: 'FieldTextBox',
									title: 'Val 2',
									value: '',
									helpText: '',
									sortIndex: 15,
									fieldOptions: {
										tableGuid:
											'e9f6bea2-abb8-45c5-a2c5-feda2fa8e184',
										columnWidth: 3,
									},
									guid: '5715dea3-713c-4578-a629-46a9adcd10c3',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2117,
								},
								{
									type: 'FieldTextArea',
									title: 'AREA',
									value: '',
									helpText: 'help text',
									sortIndex: 4,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '1ffc4d16-e7eb-468c-b51a-945991d37864',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 2202,
								},
							],
							sortIndex: 0,
							id: 276,
						},
					],
					displayRules: [
						{
							guid: '69573573-d718-4c16-8bf2-f9db4809cef0',
							title: 'visningsregel radioknapp',
							fieldGuid: '51d3984f-99b1-4fa1-8bd8-70bc49d086fc',
							fieldOptionId:
								'dbe2f34f-6cfb-49a4-9fad-f31759c76a57',
							metadata: '',
							formId: 168,
							colorCode: '#5b936f',
							id: 471,
						},
					],
					lifeSituations: [{ title: 'Test', id: 3 }],
					categories: [{ title: 'Jobb och företagande', id: 9 }],
					pM3: { title: 'asdfasdfasd', id: 31 },
					receiver: {
						adminTitle: 'Roy och Rogers mack',
						title: 'Roy och Rogers mack',
						url: 'https://umea.se/umeakommun/kulturochfritid/idrottmotionochfriluftsliv/friluftslivochmotion.4.bbd1b101a585d7048000151298.html',
						id: 1,
					},
					templateGuid: '',
					createdBy: 'test.testsson@test.se',
					created: '2022-05-30T09:30:28.0638403',
					modifiedBy: 'test.testsson@test.se',
					modified: '2022-09-12T08:26:15.0381371',
					dateSchedule: {
						from: '2022-07-04T00:31:00Z',
						to: '2022-07-04T07:31:00Z',
						active: false,
						formId: 168,
						id: 138,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: true,
						phoneNumberMandatory: true,
						trustLevel: 3,
						formId: 168,
						canApplyForAnother: false,
						authClient: [
							'Publik',
							'Anonym',
							'Azure ActiveDirectory',
						],
						showUserContactInformation: true,
						multipleLegitimation: false,
						contactPaths: [],
						id: 149,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					disablePrintPdf: false,
					printFieldPersonnumber: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
						id: 32,
					},
				},
				type: 'form',
			},
			errors: [],
			id: 168,
		},
		{
			links: { self: 'http://localhost:3000' },
			data: {
				id: '171',
				attributes: {
					title: 'Test Validering',
					description: 'hej',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'form-2022-06-02T08:14:38696Z',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 2286,
								},
							],
							id: 390,
						},
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'Mail till gustav',
									data: {},
									id: 2287,
								},
								{
									key: 'subject',
									value: 'Hej',
									data: {},
									id: 2288,
								},
								{
									key: 'attachFiles',
									value: 'false',
									data: {},
									id: 2289,
								},
								{ key: 'body', value: '', data: {}, id: 2290 },
								{
									key: 'sender',
									value: 'noreply.e-service@services.umea.se',
									data: {},
									id: 2291,
								},
								{
									key: 'receiver',
									value: 'test.testsson@test.se',
									data: {},
									id: 2292,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [],
									id: 2293,
								},
							],
							id: 391,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								adminTitle: 'Test',
								title: 'Test',
								url: 'https://www.umea.se/kommun',
								id: 5,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Steg 1',
							description: '',
							fields: [
								{
									type: 'FieldTextBox',
									title: 'Fält - Obligatorisk fält',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'c36ed89c-ebf0-48b5-abf4-dc9724ebfb46',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1939,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält - Endast siffror',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										validation: [
											{
												title: 'Endast siffror',
												type: 'numeric',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '926a9a45-35e4-4021-a613-76aa96ff88d9',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1940,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält - Korrekt postnummer',
									value: '',
									helpText: '',
									sortIndex: 3,
									fieldOptions: {
										validation: [
											{
												title: 'Korrekt postnummer',
												type: 'zipCode',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '91974252-2288-4e5f-871c-b34a4e7f59b6',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1941,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält - Korrekt Mac-adress',
									value: '',
									helpText: '',
									sortIndex: 4,
									fieldOptions: {
										validation: [
											{
												title: 'Korrekt Mac-adress',
												type: 'macAddress',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'd37ecd67-a9fb-44b4-b1dc-94cf1fa9e172',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1942,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält - Max 50 tecken',
									value: '',
									helpText: '',
									sortIndex: 5,
									fieldOptions: {
										validation: [
											{
												title: 'Max 50 tecken (databas liten)',
												type: 'charMaxSize50',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'b99dbae5-cbea-48f8-b689-98af82f1d55e',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1943,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält - Max 255 tecken',
									value: '',
									helpText: '',
									sortIndex: 6,
									fieldOptions: {
										validation: [
											{
												title: 'Max 255 tecken (Sharepoint)',
												type: 'charMaxSize255',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'e263d559-93e2-486a-9661-937aeca15eb5',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1944,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält - Max 500 tecken',
									value: '',
									helpText: '',
									sortIndex: 7,
									fieldOptions: {
										validation: [
											{
												title: 'Max 5000 tecken (databas stor)',
												type: 'charMaxSize5000',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '63f102b0-0ccf-4910-84c6-b391595e8c8c',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1945,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält - Korrekt personnummer',
									value: '',
									helpText: '',
									sortIndex: 8,
									fieldOptions: {
										validation: [
											{
												title: 'Korrekt personnummer',
												type: 'validPersNumber',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '94d333fe-1244-48c9-9154-bc8f77d81a81',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1946,
								},
								{
									type: 'FieldTextBox',
									title: 'Fält - Korrekt email',
									value: '',
									helpText: '',
									sortIndex: 9,
									fieldOptions: {
										validation: [
											{
												title: 'Korrekt email',
												type: 'email',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: '6368e193-1bed-4356-921f-4ad74f8516ac',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1947,
								},
								{
									type: 'FieldTextBox',
									title: 'Multi Fält - Email & max 50 tecken',
									value: '',
									helpText: '',
									sortIndex: 10,
									fieldOptions: {
										validation: [
											{
												title: 'Korrekt email',
												type: 'email',
												value: '',
												requiresValue: false,
											},
											{
												title: 'Max 50 tecken (databas liten)',
												type: 'charMaxSize50',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'b98e652b-42c6-4dfe-aefa-ebdf45106355',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1948,
								},
								{
									type: 'FieldTextBox',
									title: 'Multi Fält -  Obligatoriskt och endast siffror',
									value: '',
									helpText: '',
									sortIndex: 11,
									fieldOptions: {
										validation: [
											{
												title: 'Obligatoriskt fält',
												type: 'required',
												value: '',
												requiresValue: false,
											},
											{
												title: 'Endast siffror',
												type: 'numeric',
												value: '',
												requiresValue: false,
											},
										],
									},
									guid: 'b18995e2-ad20-40e4-a1b2-584339ce094b',
									displayRuleGuids: {},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 1949,
								},
							],
							sortIndex: 1,
							id: 281,
						},
					],
					displayRules: [],
					lifeSituations: [{ title: 'Test', id: 3 }],
					categories: [{ title: 'Jobb och företagande', id: 9 }],
					pM3: { title: 'asdfasdfasd', id: 31 },
					receiver: {
						adminTitle: 'Färdtjänst',
						title: 'Färdtjänst',
						url: 'https://www.umea.se/umeakommun/omsorgochhjalp/resortransporterochbesok/fardtjanst.4.bbd1b101a585d7048000172719.html',
						id: 32,
					},
					templateGuid: '',
					createdBy: 'test.testsson@test.se',
					created: '2022-06-02T08:14:52.2917596',
					modifiedBy: 'test.testsson@test.se',
					modified: '2022-06-03T09:46:46.0267021',
					dateSchedule: {
						from: '2022-06-02T08:16:52.9248226Z',
						to: '2022-06-02T08:16:52.9248285Z',
						active: false,
						formId: 171,
						id: 139,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						trustLevel: 3,
						formId: 171,
						canApplyForAnother: false,
						authClient: ['Anonym', 'Publik'],
						showUserContactInformation: true,
						multipleLegitimation: false,
						contactPaths: [],
						id: 152,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					disablePrintPdf: false,
					printFieldPersonnumber: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
						id: 36,
					},
				},
				type: 'form',
			},
			errors: [],
			id: 171,
		},

		{
			links: {
				self: 'http://localhost:3000',
			},
			data: {
				id: '308',
				attributes: {
					title: 'Integration till public 360',
					description: '<p>Testar public 360</p>',
					status: 'Published',
					type: 'EService',
					linkUrl: '',
					path: 'integration-till-public-360',
					integrations: [
						{
							type: 'EmailNotification',
							options: [
								{
									key: 'title',
									value: 'Bekräftelsemejl',
									data: {},
									id: 3473,
								},
							],
							id: 630,
						},
						{
							type: 'Email',
							options: [
								{
									key: 'title',
									value: 'E-post',
									data: {},
									id: 3474,
								},
								{
									key: 'subject',
									value: 'Test',
									data: {},
									id: 3475,
								},
								{
									key: 'sender',
									value: 'noreply.e-service@testservice.umea.se',
									data: {},
									id: 3476,
								},
								{
									key: 'formFieldReceivers',
									value: '',
									data: [],
									id: 3477,
								},
								{
									key: 'attachFiles',
									value: 'false',
									data: {},
									id: 3478,
								},
								{
									key: 'body',
									value: '<p>Test</p>',
									data: {},
									id: 3479,
								},
								{
									key: 'receiver',
									value: 'test@test.se',
									data: {},
									id: 3480,
								},
							],
							id: 631,
						},
						{
							type: 'OnPrem',
							options: [
								{
									key: 'datasourcename',
									value: 'Public360',
									data: {},
									id: 3530,
								},
								{
									key: 'title',
									value: 'Public 360 integration',
									data: {},
									id: 3531,
								},
								{
									key: 'caseTitle',
									value: 'Titel på nytt ärende Public 360',
									data: {},
									id: 3532,
								},
								{
									key: 'responsibleEnterpriseRecno',
									value: '100001',
									data: {},
									id: 3533,
								},
								{
									key: 'accessGroupRecno',
									value: '100072',
									data: {},
									id: 3534,
								},
								{
									key: 'journalUnitRecno',
									value: '200002',
									data: {},
									id: 3535,
								},
								{
									key: 'documentArchiveRecno',
									value: '2000',
									data: {},
									id: 3536,
								},
								{
									key: 'documentCategoryRecno',
									value: '110',
									data: {},
									id: 3537,
								},
								{
									key: 'documentStatusRecno',
									value: '1',
									data: {},
									id: 3538,
								},
								{
									key: 'confidential',
									value: 'false',
									data: {},
									id: 3539,
								},
								{
									key: 'addContact',
									value: 'false',
									data: {},
									id: 3539,
								},
							],
							id: 638,
						},
					],
					gDPR: {
						dataControllers: [
							{
								type: 'dataController',
								adminTitle: 'Test',
								title: 'Test',
								url: 'https://www.umea.se/kommun',
								id: 5,
							},
						],
					},
					steps: [
						{
							type: 'step',
							title: 'Första steget',
							description: 'Test version',
							fields: [
								{
									type: 'FieldTextBox',
									title: 'Namn',
									value: '',
									helpText: '',
									sortIndex: 1,
									fieldOptions: {},
									guid: '91f3479c-6341-4440-b8f4-903199d3a994',
									displayRuleGuids: {},
									displayRuleGroup: {
										displayRuleGroupGuid: '',
										queryOption: '',
										conditions: [],
										groups: [],
										id: 0,
									},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 3143,
								},
								{
									type: 'FieldSelectList',
									title: 'Årstid',
									value: '',
									helpText: '',
									sortIndex: 2,
									fieldOptions: {
										items: [
											{
												title: 'Vår',
												isChecked: false,
												id: 'eaa3673d-e0a2-4a15-a4e4-01621d264b4a',
												helptext: '',
											},
											{
												title: 'Sommar',
												isChecked: false,
												id: 'd948991e-893e-42c7-bcf9-dff417255798',
												helptext: '',
											},
											{
												title: 'Höst',
												isChecked: false,
												id: '1913ed18-989b-4dd4-9dab-3be2c21b1e90',
												helptext: '',
											},
											{
												title: 'Vinter',
												isChecked: false,
												id: 'b80b85ad-21e4-4138-952a-b7b57b61ebe5',
												helptext: '',
											},
										],
									},
									guid: '467b0105-44bc-4e31-9378-cc7cbebbe754',
									displayRuleGuids: {},
									displayRuleGroup: {
										displayRuleGroupGuid: '',
										queryOption: '',
										conditions: [],
										groups: [],
										id: 0,
									},
									displayRuleAnother: false,
									displayRuleMultipleLegitimation: false,
									id: 3144,
								},
							],
							sortIndex: 0,
							id: 451,
						},
					],
					displayRules: [],
					lifeSituations: [
						{
							title: 'Test',
							id: 3,
						},
					],
					categories: [
						{
							title: 'Test',
							id: 19,
						},
					],
					pM3: {
						title: 'Test',
						id: 44,
					},
					receiver: {
						adminTitle: 'Test',
						title: 'Test',
						url: '',
						id: 28,
					},
					templateGuid: '',
					createdBy: 'test.testsson@test.se',
					created: '2023-03-06T06:34:03.3353147',
					modifiedBy: 'test.testsson@test.se',
					modified: '2023-03-09T06:19:21.6315651',
					dateSchedule: {
						from: '2023-03-06T06:35:41.3362707Z',
						to: '2023-03-06T06:35:41.3362732Z',
						active: false,
						formId: 308,
						id: 210,
					},
					applyingForAnother: false,
					comments: [],
					userRequirement: {
						addressMandatory: true,
						emailMandatory: false,
						phoneNumberMandatory: false,
						trustLevel: 3,
						formId: 308,
						canApplyForAnother: false,
						authClient: ['Anonym'],
						showUserContactInformation: true,
						multipleLegitimation: false,
						contactPaths: [],
						id: 289,
					},
					hidden: false,
					hidePersonNumber: false,
					simpleEservice: false,
					disablePrintPdf: false,
					printFieldPersonnumber: false,
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
						id: 172,
					},
					recentSubmits: 0,
				},
				type: 'form',
			},
			errors: [],
			id: 308,
		},
	],
	emptyForm: {
		id: 1234,
		links: {
			self: 'http://localhost:3000',
		},
		errors: [],
		type: 'form',
		path: '1234',
		attributes: {
			title: '',
			path: 'mockedpath',
			description: '',
			category: '',
			status: '',
			gDPR: {},
			integrations: [],
			steps: [],
		},
	},
	validationRuleTypes: [
		{
			type: 'required',
			requiresValue: false,
		},
		{
			type: 'numeric',
			requiresValue: false,
		},
		{
			type: 'validPersNumber',
			requiresValue: false,
		},
		{
			type: 'zipCode',
			requiresValue: false,
		},
		{
			type: 'macAddress',
			requiresValue: false,
		},
		{
			type: 'charMaxSize50',
			requiresValue: false,
		},
		{
			type: 'charMaxSize255',
			requiresValue: false,
		},
		{
			type: 'charMaxSize5000',
			requiresValue: false,
		},
	],
	lifeSituations: [
		{
			title: 'Tanka',
			id: 1,
		},
		{
			title: 'Årstider',
			id: 2,
		},
		{
			title: 'Flytta in',
			id: 12,
		},
		{
			title: 'Flytta ut',
			id: 13,
		},
		{
			title: 'Jobb',
			id: 14,
		},
		{
			title: 'Resa',
			id: 99,
		},
	],
	categories: [
		{
			title: 'Bygga & Bo',
			id: 1,
		},
		{
			title: 'Kommun & politik',
			id: 2,
		},
		{
			title: 'Barn & skola',
			id: 12,
		},
		{
			title: 'Uppleva & göra',
			id: 13,
		},
		{
			title: 'Omsorg & hjälp',
			id: 14,
		},
		{
			title: 'Trafik & resor',
			id: 15,
		},
		{
			title: 'Jobb & företagande',
			id: 16,
		},
	],
	pM3s: [
		{
			title: 'Färdtjänst',
			id: 1,
		},
		{
			title: 'Omsorg',
			id: 4,
		},
		{
			title: 'Arbetsliv',
			id: 5,
		},
	],
	receivers: [
		{
			title: 'Styrelsen',
			adminTitle: 'Styrelsen',
			url: 'https://www.any.com/start.html',
			id: 12,
		},
		{
			title: 'Administration och innovation',
			adminTitle: 'Administration och innovation',
			url: 'https://www.any.com/start.html',
			id: 13,
		},
		{
			title: 'Jobbet',
			adminTitle: 'Jobbet',
			url: 'https://www.any.com/start.html',
			id: 19,
		},
	],
	gDPRs: [
		{
			title: 'Tekniska',
			adminTitle: 'Tekniska',
			url: 'https://www.any.com/start.html',
			id: 1,
		},
		{
			title: 'Styrelsen',
			adminTitle: 'Styrelsen',
			url: 'https://www.any.com/start.html',
			id: 12,
		},
	],
	multiSigning: {
		data: {
			form: {
				Attributes: {
					Title: 'Multipel legitimering',
					Description: '<p>Barn foto</p>',
					Status: 'Published',
					type: 'EService',
					Path: 'multipel-legitimering',
					Integrations: [
						{
							Type: 'EmailNotification',
							Options: [
								{
									Key: 'title',
									Value: 'Bekräftelsemejl',
									Data: {},
									Id: 951,
								},
							],
							Id: 166,
						},
						{
							Type: 'Email',
							Options: [
								{
									Key: 'title',
									Value: 'Email',
									Data: {},
									Id: 961,
								},
								{
									Key: 'subject',
									Value: 'Multipel',
									Data: {},
									Id: 962,
								},
								{
									Key: 'attachFiles',
									Value: 'true',
									Data: {},
									Id: 963,
								},
								{
									Key: 'body',
									Value: '<p>Skicka in multiple</p>',
									Data: {},
									Id: 964,
								},
								{
									Key: 'sender',
									Value: 'no@test.se',
									Data: {},
									Id: 965,
								},
								{
									Key: 'receiver',
									Value: 'kajsa.anka@test.se',
									Data: {},
									Id: 966,
								},
								{
									Key: 'formFieldReceivers',
									Value: '',
									Data: [],
									Id: 967,
								},
							],
							Id: 170,
						},
					],
					GDPR: {
						DataControllers: [
							{
								Type: 'dataController',
								Title: 'Styrelsen',
								Url: 'https://www.any.com/start.html',
								Id: 12,
							},
						],
					},
					Steps: [
						{
							Fields: [
								{
									Type: 'FieldSelectList',
									Title: 'Barn',
									FieldOptions: {
										Items: [
											{
												Title: 'Tjatte Anka',
												Value: null,
												IsChecked: false,
												Id: 'Tjatte Anka',
											},
											{
												Title: 'Knatte Anka',
												Value: null,
												IsChecked: false,
												Id: 'Knatte Anka',
											},
											{
												Title: 'Fnatte Anka',
												Value: null,
												IsChecked: true,
												Id: 'Fnatte Anka',
											},
										],
										TableGuid: null,
										TableRows: null,
									},
									Value: '',
									HelpText: '',
									SortIndex: 1,
									Guid: '017ebc3e-85b7-40f9-8156-d0dc9f5d08c5',
									DisplayRuleGuids: [],
									DisplayRuleAnother: false,
									DisplayRuleMultipleLegitimation: true,
									Id: 618,
								},
								{
									Type: 'FieldCheckBox',
									Title: 'Samtycke till fotografering',
									FieldOptions: {
										Items: [
											{
												Title: 'Ja, jag samtycker till att skolan/förskolan fotograferar mitt barn i skolsituationer, i undervisningen eller för dokumentation.',
												Value: null,
												IsChecked: true,
												Id: '06b5fd4c-8283-4907-9a93-693a6b623c6a',
											},
										],
										TableGuid: null,
										TableRows: null,
									},
									Value: '',
									HelpText: '',
									SortIndex: 2,
									Guid: 'd76665ea-3dd0-4d6e-bebd-76e713fbed90',
									DisplayRuleGuids: [],
									DisplayRuleAnother: false,
									DisplayRuleMultipleLegitimation: false,
									Id: 619,
								},
							],
							Type: 'step',
							Title: 'Steg 1',
							Description: '',
							SortIndex: 0,
							Id: 118,
						},
					],
					DisplayRules: [],
					lifeSituations: [
						{
							title: 'Årstider',
							id: 2,
						},
					],
					categories: [
						{
							title: 'Omsorg & hjälp',
							id: 14,
						},
					],
					pM3: {
						title: 'Omsorg',
						id: 4,
					},
					Receiver: {
						Title: 'Styrelsen',
						Url: 'https://www.any.com/start.html',
						Id: 12,
					},
					CreatedBy: 'kajsa.anka@test.se',
					Created: '2020-05-20T11:54:16.4905697',
					ModifiedBy: 'kajsa.anka@test.se',
					Modified: '2020-06-04T12:21:43.9096181',
					DateSchedule: {
						From: '2020-05-20T12:07:50.6831708Z',
						To: '2020-05-20T12:07:50.6831732Z',
						Active: false,
						FormId: 74,
						Id: 50,
					},
					ApplyingForAnother: false,
					Comments: [],
					UserRequirement: {
						AddressMandatory: false,
						EmailMandatory: true,
						PhoneNumberMandatory: true,
						FormId: 74,
						CanApplyForAnother: false,
						authClient: ['Publik'],
						ShowUserContactInformation: true,
						MultipleLegitimation: true,
						contactPaths: [1, 2],
						Id: 55,
					},
					Hidden: false,
					HidePersonNumber: false,
					SimpleEservice: false,
					userContactInfos: [
						{
							id: 'Fnatte Anka',
							childSocialSecurityNumber: '201109099999',
							childName: 'Fnatte Anka',
							childFirstName: 'Fnatte',
							childLastName: 'Anka',
							socialSecurityNumber: '199909098888',
							name: 'Kalle Anka',
							address: 'ANKEBORGSVÄGEN 10',
							postalNumber: '12345',
							city: 'ANKEBORG',
							phoneNumber: '',
							email: 'kalle.anka@test.se',
							isSelected: true,
						},
					],
					followUp: {
						activation: 'None',
						averageTreatmentTime: '',
					},
				},
				Id: '74',
				Type: 'form',
			},
			userContactInfo: {
				SocialSecurityNumber: '199909099999',
				ContactPath: 1,
				FirstName: 'KAJSA',
				LastName: 'ANKA',
				Address: 'ANKEBORGSVÄGEN 10',
				PostalNumber: '12345',
				City: 'ANKEBORG',
				PhoneNumber: '0701234567',
				Email: 'kajsa.anka@test.se',
			},
			id: '7dec2483-af7d-46b0-a3b0-1ecc325b3fa0',
		},
	},
	banners: [
		{
			id: 1,
			text: 'Vi har för närvarande problem med BankID',
			active: false,
			modified: '2023-04-14 11:48:30.1049404',
		},
	],
};
