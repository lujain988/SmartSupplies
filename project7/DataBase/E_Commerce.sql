create database E_Commerce 
Use E_Commerce 

CREATE TABLE Users (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    PasswordHash varbinary(max),
	PasswordSalt  varbinary(max),
    Role NVARCHAR(50) CHECK (Role IN ('Admin', 'User')) DEFAULT 'User',
    LoyaltyPoints INT DEFAULT 0,
    IsAdmin BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
	
	
);
ALTER TABLE Users
ADD CONSTRAINT DF_Users_Role DEFAULT 'User' FOR Role;


-- Categories Table
CREATE TABLE Categories (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(max),
	Image nvarchar (max)
);

-- Products Table
CREATE TABLE Products (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT FOREIGN KEY REFERENCES Categories(ID),
    ProductName NVARCHAR(100) NOT NULL,
    Description NVARCHAR(max),
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL,
    Image NVARCHAR(max),
    Discount DECIMAL(5, 2) DEFAULT 0
);

-- Cart Table
CREATE TABLE Cart (
    ID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    ProductID INT FOREIGN KEY REFERENCES Products(ID),
    Quantity INT NOT NULL
);





-- Orders Table
CREATE TABLE Orders (
    ID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status NVARCHAR(50) CHECK (Status IN ('Pending', 'Shipped', 'Delivered')),
    LoyaltyPoints INT DEFAULT 0,
	transactionId VARCHAR(255) ,
	ProductId int REFERENCES Products (Id),
	   Quantity INT 

);


CREATE TABLE Payments (
    ID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES Orders(ID),  
    PaymentMethod NVARCHAR(50) NOT NULL,
    PaymentAmount DECIMAL(10, 2) NOT NULL,
    PaymentDate DATETIME DEFAULT GETDATE(),
    PaymentStatus NVARCHAR(50) CHECK (PaymentStatus IN ('Pending', 'Completed', 'Failed')),
    TransactionID NVARCHAR(100)
);

-- LoyaltyPoints Table
CREATE TABLE LoyaltyPoints (
    ID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    PointsEarned INT NOT NULL,
    PointsUsed INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Vouchers Table
CREATE TABLE Vouchers (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Code NVARCHAR(50) NOT NULL,
    DiscountAmount DECIMAL(5, 2) NOT NULL,
    ExpirationDate DATETIME NOT NULL,
    IsActive BIT DEFAULT 1
	OrderID int references Orders(ID)
);
ALTER TABLE Vouchers
ADD OrderID int references Orders(ID)

-- Reviews Table
CREATE TABLE Reviews (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT FOREIGN KEY REFERENCES Products(ID),
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(max),
	Status nvarchar (20) default 'pending'
);

-- Addresses Table
CREATE TABLE Addresses (
    ID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    AddressLine NVARCHAR(255) NOT NULL,
    City NVARCHAR(100),
    Country NVARCHAR(100),
    PostalCode NVARCHAR(20),
	PhoneNumber nvarchar (15)

); 
CREATE TABLE ContactUs (
    [ID] INT IDENTITY(1,1) PRIMARY KEY, 
    [UsersID] INT REFERENCES [Users](ID),
    [Message] NVARCHAR(MAX),
    [Name] NVARCHAR(255),
    [PhoneNumber] NVARCHAR(20),
    [Subject] NVARCHAR(500),
    [Email] NVARCHAR(255),
    [ReplyMessage] NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE()
);

----------- Edited---------------
ALTER TABLE Orders
ALTER COLUMN transactionId VARCHAR(255);

ALTER TABLE Users
ADD CONSTRAINT DF_Users_Role DEFAULT 'User' FOR Role;