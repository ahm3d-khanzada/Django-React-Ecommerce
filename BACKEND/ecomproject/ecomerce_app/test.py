import smtplib
from email.mime.text import MIMEText

msg = MIMEText('This is a test email')
msg['Subject'] = 'Test Email'
msg['From'] = 'ahm3d.workspace@gmail.com'
msg['To'] = '213188@students.au.edu.pk'

try:
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login('ahm3d.workspace@gmail.com', 'scly zaxg hlsd irjs')
    server.sendmail('ahm3d.workspace@gmail.com', '213188@students.au.edu.pk', msg.as_string())
    print('Email sent successfully')
except Exception as e:
    print(f'Error: {e}')
finally:
    server.quit()