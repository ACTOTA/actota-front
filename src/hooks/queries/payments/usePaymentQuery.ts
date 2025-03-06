import { useQuery } from '@tanstack/react-query';

interface PaymentMethod {
	// Define your activity type here
	id: string;
	// ... other fields
}

async function fetchPaymentMethodsById(id: string): Promise<PaymentMethod[]> {
	const response = await fetch(`/api/account/${id}`, {
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Failed to fetch payment methods');
	}

	return response.json();
}

export function usePaymentMethods(id: string) {
	return useQuery({
		queryKey: ['paymentMethodsById', id],
		queryFn: () => fetchPaymentMethodsById(id),
	});
}
