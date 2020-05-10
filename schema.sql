DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE departments(
    id INTEGER NO NULL AUTO_INCREMENT,
    departmentName VARCHAR NO NULL,
    PRIMARY KEY(id)
);

CREATE TABLE roles(
    id INTEGER NO NULL AUTO_INCREMENT,
    roleName VARCHAR NO NULL,
    salary DECIMAL NO NULL,
    department_id INTEGER NO NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employees(
    id INTEGER NO NULL AUTO_INCREMENT,
    first_name VARCHAR NO NULL,
    last_name VARCHAR NO NULL,
    role_id INTEGER NO NULL,
    manager_id INTEGER,
    PRIMARY KEY(id)
);