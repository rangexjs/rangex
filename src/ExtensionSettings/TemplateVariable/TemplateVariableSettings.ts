import type {
	TemplateVariableExtensionSettings,
	TemplateVariableModalSettings,
} from "@rangex/rich-text-editor/template-variable";

type FieldName = "fullName" | "firstName" | "lastName" | "email" | "date";

const nameModalSettings: TemplateVariableModalSettings<FieldName> = {
	title: "Name",
	inputs: [
		{
			label: "First name",
			placeholder: "John",
			readFields: ({ firstName }, fieldsConfig) =>
				firstName === fieldsConfig.firstName.placeholder ? "" : firstName,
		},
		{
			label: "Last name",
			placeholder: "Doe",
			readFields: ({ lastName }, fieldsConfig) =>
				lastName === fieldsConfig.lastName.placeholder ? "" : lastName,
		},
	],
	onUpdate([firstValue, lastValue], fieldsConfig) {
		const fullValue = [firstValue, lastValue].filter(Boolean).join(" ");

		return {
			firstName: firstValue || fieldsConfig.firstName.placeholder,
			lastName: lastValue || fieldsConfig.lastName.placeholder,
			fullName: fullValue || fieldsConfig.fullName.placeholder,
		};
	},
};

export const templateVariableSettings: TemplateVariableExtensionSettings<FieldName> = {
	fieldsConfig: {
		fullName: { placeholder: "{{Full name}}" },
		firstName: { placeholder: "{{First name}}" },
		lastName: { placeholder: "{{Last name}}" },
		email: { placeholder: "{{Email}}" },
		date: { placeholder: "{{Date}}" },
	},
	dropdown: [
		{
			label: "Full name",
			fieldName: "fullName",
			settings: nameModalSettings,
		},
		{
			label: "First name",
			fieldName: "firstName",
			settings: nameModalSettings,
		},
		{
			label: "Last name",
			fieldName: "lastName",
			settings: nameModalSettings,
		},
		{
			label: "Email",
			fieldName: "email",
			settings: {
				title: "Email",
				inputs: [
					{
						label: "Email",
						placeholder: "name@mail.com",
						patterns: [{ value: /.+@.+\..+/, message: "Email's format is invalid." }],
						readFields: ({ email }, fieldsConfig) =>
							email === fieldsConfig.email.placeholder ? "" : email,
					},
				],
				onUpdate: ([emailValue], fieldsConfig) => ({
					email: emailValue || fieldsConfig.email.placeholder,
				}),
			},
		},
		{
			label: "Date",
			fieldName: "date",
			settings: {
				title: "Date",
				inputs: [
					{
						label: "Date",
						placeholder: "2012-05-22",
						patterns: [
							{
								value: /\d{4}-\d{2}-\d{2}/,
								message: "Date must be a valid ISO format. (YYYY-MM-DD)",
							},
						],
						readFields: ({ date }, fieldsConfig) =>
							date === fieldsConfig.date.placeholder ? "" : date,
					},
				],
				onUpdate: ([dateValue], fieldsConfig) => ({
					date: dateValue || fieldsConfig.date.placeholder,
				}),
			},
		},
	],
};
