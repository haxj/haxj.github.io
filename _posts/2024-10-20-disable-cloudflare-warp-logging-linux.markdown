---
layout: post
title:  "How to change the log level of Cloudflare's warp-svc on Linux"
date:   2024-10-20 21:24:12 +0700
categories: [blog, technical]
tags: [linux, cloudflare, warp, systemd]
---


If you're using Cloudflare's WARP on Linux, you'll probably notice that the `warp-svc` service pollutes syslog quite a lot:

```console
$ journalctl -b -u warp-svc
...
Oct 20 21:15:01 mypc warp-svc[900]: 2024-10-20T14:15:01.026Z  INFO warp::warp_service::ipc_loop: IPC...
Oct 20 21:15:02 mypc warp-svc[900]: 2024-10-20T14:15:02.381Z DEBUG main_loop: warp::warp_service::ipc_handlers: Ipc...
...
```

Lots of `info` and `debug` messages here. By default, this service's log level is `debug`. No wonder!

It looks like Cloudflare provides no configuration option for changing its log level. Luckily, we can change it by setting `LogLevelMax` option in `warp-svc`'s SystemD unit file ([see docs here](https://www.freedesktop.org/software/systemd/man/latest/systemd.exec.html#LogLevelMax=)).

- First, let's find out the path to unit file:

```console
$ systemctl cat warp-svc.service
# /lib/systemd/system/warp-svc.service
...
```

- Next, open the unit file and add `LogLevelMax=err` to the `[Service]` section. This change the log level to `error` instead of `debug`. The resulting file should look something like this:

```console
$ cat /lib/systemd/system/warp-svc.service
[Unit]
Description=Cloudflare Zero Trust Client Daemon
After=pre-network.target

[Service]
Type=simple
ExecStart=/bin/warp-svc
DynamicUser=no
CapabilityBoundingSet=CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_SYS_PTRACE
AmbientCapabilities=CAP_NET_ADMIN CAP_NET_BIND_SERVICE CAP_SYS_PTRACE
StateDirectory=cloudflare-warp
RuntimeDirectory=cloudflare-warp
LogsDirectory=cloudflare-warp
Restart=always
LogLevelMax=err    # Set the log level here

[Install]
WantedBy=multi-user.target
```

- Reload the unit file and restart `warp-svc`:

```console
$ sudo systemctl daemon-reload
$ sudo systemctl restart warp-svc.service
```

- Finally, check the syslog. `warp-svc` should no longer spam syslog with `info` and `debug` messages anymore.

P.S. Another way to modify the SystemD unit file is to use this command:

```console
$ sudo systemctl edit warp-svc.service
```

