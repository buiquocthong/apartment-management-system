# Apartment Environment

The docker should install the machine.

*Step 1*

To share/communicate between difference docker-compose files, we need to create the external network.
To make the external network by the command:

```shell
   docker network create shared_env_net
```

*Step 2*
* Go to the _env_ folder and run the required services by the below command:

```shell
   docker compose up -d
   [or]
   docker-compose up -d
```

* Go to the _apartment_ folder and run the required services by the below command:

```shell
      docker compose up
```

# Dashboard

*Eureka Discover*

| URL | Credentials | Description |
| http://localhost:8761 | admin/admin | N/A |

*e-Mail Web UI*

| URL | Credentials | Description |
| http://localhost:8000 | noreply/admin1! | N/A |

*Greenmail Open API*
| URL | Credentials | Description |
| http://localhost:8181 | N/A | N/A |