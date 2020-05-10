DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE departments(
    id INTEGER NOT NULL AUTO_INCREMENT,
    departmentName VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE roles(
    id INTEGER NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employees(
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    PRIMARY KEY(id)
);