variable "url" {
    type = string
    default = getenv("OPERATIONS_DB_URL")
}

env "local" {
    url = var.url
        
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
