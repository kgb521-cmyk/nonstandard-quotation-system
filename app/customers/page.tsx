import { CustomerManagement } from "../../components/customers/customer-management";
import { listCustomers } from "../../src/server/db/quotation-repository";

export default async function CustomersPage() {
  const customers = await listCustomers();

  return (
    <CustomerManagement
      initialCustomers={customers.map((customer) => ({
        id: customer.id,
        company: customer.company,
        contactName: customer.contactName,
        industry: customer.industry,
        region: customer.region
      }))}
    />
  );
}
