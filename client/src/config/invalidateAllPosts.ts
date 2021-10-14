import {Cache} from '@urql/exchange-graphcache';

export const invalidateAllPosts = (cache: Cache) => {
	const allFields = cache.inspectFields('Query');
	const fieldInfos = allFields.filter((info) => info.fieldName === 'posts');
	fieldInfos.forEach((fi) => {
		cache.invalidate('Query', 'posts', fi.arguments || {});
	});
};
