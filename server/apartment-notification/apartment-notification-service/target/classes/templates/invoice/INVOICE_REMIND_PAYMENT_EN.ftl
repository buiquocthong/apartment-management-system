<html>
<body>
<p>Dear ${resident_name},</p>

<p>Overdue Apartment Payment</p>
<p>We are writing to inform you that your payment for apartment ${apartment_name} is currently overdue.</p>

<p>Invoice Details:</p>
<ul>
    <li>Issue Date: ${created_date}</li>
    <li>Payment Deadline: ${payment_deadline}</li>
    <li>Status: ${status}</li>
</ul>

<table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
    <tr>
        <th>Service</th>
        <th>Old Value</th>
        <th>New Value</th>
        <th>Amount Used</th>
        <th>Total (VND)</th>
    </tr>
    <#list service_details as detail>
        <tr>
            <td style="text-align: left;">${detail.service.name}</td>
            <td style="text-align: right;">${detail.old_value?string["0.##"]}</td>
            <td style="text-align: right;">${detail.new_value?string["0.##"]}</td>
            <td style="text-align: right;">${detail.amount_of_using?string["0.##"]}</td>
            <td style="text-align: right;">${detail.money?string}</td>
        </tr>
    </#list>
</table>

<p>Penalty Fee: ${penalty_fee} VND</p>
<p>Total Amount: ${total} VND</p>

<p>REQUIRED ACTIONS:</p>
<p>Please settle the full payment before ${extra_payment_deadline}</p>
<p>Failure to pay within the specified timeframe will result in enforcement measures as per the lease agreement</p>

<p>Kind Regards,<br>The Apartment Management Team</p>
</body>
</html>