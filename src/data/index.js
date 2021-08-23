export default [
	{
		id: ':sample:mars-weather-report-feb14-20-2019',
		permanent: true,
		metadata: {
			title: 'Mars Weather Report Feb 24-20 2019'
		},
		attachments: {
			data: () => import('./mars-weather-report-feb14-20-2019.json')
		}
	},

	{
		id: ':sample:us-historical-budget-data',
		permanent: true,
		metadata: {
			title: 'US Historical Revenue, Public Debt and GDP',
			source: 'https://www.cbo.gov/about/products/budget-economic-data'
		},
		attachments: {
			data: () => import('./us-historical-budget-data.json')
		}
	},


	{
		id: ':sample:honeyproduction',
		permanent: true,
		metadata: {
			title: 'Honey Production in the USA (1998-2012)',
			description: 'Honey Production Figures and Prices by National Agricultural Statistics Service',
			source: 'https://www.kaggle.com/jessicali9530/honey-production',
			license: 'CC0: Public Domain',
			licenseLink: 'https://creativecommons.org/publicdomain/zero/1.0/'
		},
		attachments: {
			data: () => import('./honeyproduction.json')
		}
	}
];
