DROP DATABASE IF EXISTS employes_db;
CREATE DATABASE employes_db;
USE employes_db;

CREATE TABLE departments(
    id INTEGER NO NULL AUTO_INCREMENT,
    departmentName VARCHAR NO NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles(
    id INTEGER NO NULL AUTO_INCREMENT,
    roleName VARCHAR NO NULL,
    salary DECIMAL,
    department_id INTEGER,
    PRIMARY KEY(id)
)