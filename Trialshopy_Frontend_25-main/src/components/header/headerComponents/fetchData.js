import axios from 'axios';

const fetchData = async (id) => {
	try {
		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/v1/categories`,
			{
				filters: { parent: id },
			}
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching categories:', error);
		return [];
	}
};

export default fetchData;
