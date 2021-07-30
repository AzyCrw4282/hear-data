/*
* Inherited library code for requirements handling. This is where audio context is set
*/

const specs = [
	{
		key: 'AudioContext',
		load: () => {
			if (window.AudioContext) {
				return Promise.resolve({
					AudioContext,
					OfflineAudioContext
				});
			}
			return import('standardized-audio-context').then(module => {
				const {
					AudioContext,
					OfflineAudioContext
				} = module;
				return {
					AudioContext,
					OfflineAudioContext
				};
			});
		}
	},
	{
		key: 'StoreApp',
		load: () => import('../components/StoreHandler') // contains most of the components in store
	}
];

const requirementsObj = {};
let promise = null;

async function load() {

	for (let i = 0; i < specs.length; i++) {
		const {key, load} = specs[i]; //assigns the values of them here
		requirementsObj[key] = await load();
	}

	return requirementsObj;
}
function loadSpecs() {
	if (!promise) {
		promise = load();
	}
	return promise;
}

export {
	requirementsObj,
	loadSpecs
};
