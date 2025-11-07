env "local" {
    url = "postgresql://${OPERATIONS_ROOT_USER}:${OPERATIONS_ROOT_PASSWORD}@localhost:${OPERATIONS_PORT_MAPPING}/${OPERATIONS_ROOT_DB}?sslmode=disable"
        
    src = "file://database"

    migration {
        dir = "file://migrations"
    }

    format {
        schema {
            inspect = "{{ sql . }}"
        }
    }

    dev = "docker://postgres/17/dev"
}
