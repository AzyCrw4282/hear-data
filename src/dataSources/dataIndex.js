export default [
	{
		id: ':sample:mars-weather-report-feb14-20-2019',
		permanent: true,
		metadata: {
			title: 'Mars Weather Report Feb 24-20 2019'
		},
		attachments: {
			data: () => import('./marsWeatherData-report.json')
		}
	},


	{
		id: ':sample:nyc-311-call-center-inquiries',
		permanent: true,
		metadata: {
			title: 'NYC 311 Call Volume by Agency Feb 1 - 10, 2019',
			source: 'https://data.cityofnewyork.us/City-Government/311-Call-Center-Inquiry/tdd6-3ysr'
		},
		attachments: {
			data: () => import('./nyc_call_records_data.json')
		}
	},
];