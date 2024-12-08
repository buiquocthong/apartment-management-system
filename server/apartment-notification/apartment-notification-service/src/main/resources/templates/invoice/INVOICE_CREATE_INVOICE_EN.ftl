<html>
<body>
<p>Dear ${resident_name},</p>

<p>This is your monthly invoice for apartment ${apartment_name}.</p>

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

<p>Total Amount: ${total} VND</p>

<p>
    <a href="${payment_url}"
       style="display: inline-block; padding: 10px 15px; background-color: #000000; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">
        Payment
    </a>
</p>

<p>Please complete your payment before the deadline.</p>

<p>Kind Regards,<br>The Apartment Management Team</p>
</body>
</html>