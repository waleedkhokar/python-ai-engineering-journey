INSERT INTO departments VALUES
 (1,'Engineering','Islamabad'),(2,'Sales','Lahore'),(3,'HR','Karachi'),(4,'Finance','Islamabad'),(5,'Marketing',NULL);

INSERT INTO employees VALUES
 (1,'Sara','Khan','sara@corp.com',250000,'2018-03-01',1,NULL),
 (2,'Ali','Raza','ali@corp.com',160000,'2019-06-15',1,1),
 (3,'Ahmed','Malik','ahmed@corp.com',140000,'2020-01-10',1,1),
 (4,'Hina','Shah','hina@corp.com',95000,'2021-09-20',1,2),
 (5,'Usman','Tariq','usman@corp.com',90000,'2022-02-11',1,2),
 (6,'Zara','Ahmed','zara@corp.com',180000,'2017-11-05',2,NULL),
 (7,'Bilal','Hussain','bilal@corp.com',85000,'2021-04-19',2,6),
 (8,'Nida','Farooq','nida@corp.com',78000,'2022-07-01',2,6),
 (9,'Omar','Siddiqui','omar@corp.com',120000,'2019-08-30',3,NULL),
 (10,'Fatima','Noor','fatima@corp.com',70000,'2023-01-16',3,9),
 (11,'Kamran','Yousaf','kamran@corp.com',200000,'2016-05-23',4,NULL),
 (12,'Maria','Iqbal','maria@corp.com',88000,'2022-10-03',4,11),
 (13,'Tahir','Ali',NULL,60000,'2024-02-12',NULL,NULL);

INSERT INTO customers (id,name,email,phone,country,created_at) VALUES
 (1,'Ayesha Khan','ayesha@mail.com','0300-1111111','Pakistan','2023-01-05'),
 (2,'John Smith','john@mail.com',NULL,'USA','2023-02-11'),
 (3,'Li Wei','li@mail.com','+86-100-2000','China','2023-03-20'),
 (4,'Emma Brown','emma@mail.com',NULL,'UK','2023-05-02'),
 (5,'Hassan Ali','hassan@mail.com','0301-2222222','Pakistan','2023-06-18'),
 (6,'Sofia Rossi','sofia@mail.com','+39-055-1234','Italy','2023-08-09'),
 (7,'Never Ordered','never@mail.com',NULL,'Canada','2024-01-01');

INSERT INTO categories VALUES (1,'Electronics'),(2,'Books'),(3,'Clothing'),(4,'Home');

INSERT INTO products VALUES
 (1,'Laptop',1,1200.00,15),(2,'Phone',1,800.00,40),(3,'Headphones',1,150.00,100),
 (4,'SQL Book',2,45.00,200),(5,'Novel',2,15.00,300),(6,'T-Shirt',3,20.00,500),
 (7,'Jacket',3,90.00,120),(8,'Lamp',4,35.00,80),(9,'Unsold Gadget',1,999.00,5);

INSERT INTO orders VALUES
 (1,1,'2024-01-10','paid'),(2,1,'2024-02-14','shipped'),(3,2,'2024-02-20','paid'),
 (4,3,'2024-03-05','cancelled'),(5,4,'2024-03-18','paid'),(6,5,'2024-04-01','pending'),
 (7,5,'2024-04-22','shipped'),(8,6,'2024-05-09','paid'),(9,2,'2024-05-30','paid'),
 (10,1,'2024-06-11','paid');

INSERT INTO order_items VALUES
 (1,1,1,1200.00),(1,3,2,150.00),(2,4,3,45.00),(3,2,1,800.00),(3,3,1,150.00),
 (4,7,2,90.00),(5,5,4,15.00),(5,6,2,20.00),(6,8,1,35.00),(7,1,1,1200.00),
 (7,4,1,45.00),(8,7,1,90.00),(8,6,3,20.00),(9,2,2,800.00),(10,3,1,150.00),(10,5,2,15.00);
