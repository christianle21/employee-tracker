INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES ('Christian', 'Le', '1');
INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES ('Harry', 'Styles', '2');
INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES ('Cassidy', 'Ta', '3');
INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES ('Chuck', 'Smith', '4');
INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES ('Kendrick', 'Lamar', '5');
INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES ('Amber', 'Heard', '6');
INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES ('Rebecca', 'Black', '7');
INSERT INTO `employees`.`employee` (`first_name`, `last_name`, `role_id`) VALUES ('Ludwig', 'Ahgren', '8');

UPDATE `employees`.`employee` SET `manager_id` = '1' WHERE (`id` = '2');
UPDATE `employees`.`employee` SET `manager_id` = '5' WHERE (`id` = '3');
UPDATE `employees`.`employee` SET `manager_id` = '5' WHERE (`id` = '4');
UPDATE `employees`.`employee` SET `manager_id` = '8' WHERE (`id` = '6');
UPDATE `employees`.`employee` SET `manager_id` = '8' WHERE (`id` = '7');