der Service, der den Server staret ist: 
/etc/systemd/system/deno_server.service
bzw. nur deno_server.service

- `sudo nano /etc/systemd/system/deno_server.service`
- ` sudo systemctl daemon-reload`
- `sudo systemctl enable deno_server.service`
- `sudo systemctl start deno_server.service`
- `sudo systemctl status deno_server.service`

Log einsehen: journalctl -u deno_server.service -f