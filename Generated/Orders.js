//===============================================================================		
// EntitySpaces Version : 2012.1.0000.0
// Date Generated       : 1/15/2012 12:20:55 PM
//===============================================================================

(function (es) { //myNS = "myNameSpace" ... for example purposes

	if (typeof (es) === undefined) {
		throw "Please Load EntitySpaces.Core First";
	}

	es.objects.Orders = es.defineEntity(function () {

		// core columns
		this.OrderID = ko.observable();
		this.CustomerID = ko.observable();
		this.EmployeeID = ko.observable();
		this.OrderDate = ko.observable();
		this.RequiredDate = ko.observable();
		this.ShippedDate = ko.observable();
		this.ShipVia = ko.observable();
		this.Freight = ko.observable();
		this.ShipName = ko.observable();
		this.ShipAddress = ko.observable();
		this.ShipCity = ko.observable();
		this.ShipRegion = ko.observable();
		this.ShipPostalCode = ko.observable();
		this.ShipCountry = ko.observable();

		// extended columns
		this.esExtendedData = undefined;

		// Hierarchical Properties
		this.UpToProductsCollection = undefined;
		this.OrderDetailsCollectionByOrderID = undefined;
		this.UpToCustomersByCustomerID = undefined;
		this.UpToEmployeesByEmployeeID = undefined;
		this.UpToShippersByShipVia = undefined;
	});

	//#region Prototype Level Information

	es.objects.Orders.prototype.esTypeDefs = {
		UpToProductsCollection: "ProductsCollection",
		OrderDetailsCollectionByOrderID: "OrderDetailsCollection",
		UpToCustomersByCustomerID: "Customers",
		UpToEmployeesByEmployeeID: "Employees",
		UpToShippersByShipVia: "Shippers"
	};
	
	es.objects.Orders.prototype.esRoutes = {
		commit: { method: 'PUT', url: 'Orders_Save', response: 'entity' },
		loadByPrimaryKey: { method: 'GET', url: 'Orders_LoadByPrimaryKey', response: 'entity' }
	};

	es.objects.Orders.prototype.esColumnMap = {
		'OrderID': 1,
		'CustomerID': 1,
		'EmployeeID': 1,
		'OrderDate': 1,
		'RequiredDate': 1,
		'ShippedDate': 1,
		'ShipVia': 1,
		'Freight': 1,
		'ShipName': 1,
		'ShipAddress': 1,
		'ShipCity': 1,
		'ShipRegion': 1,
		'ShipPostalCode': 1,
		'ShipCountry': 1
	};

	//#endregion

}(window.es, window.myNS));

(function (es) {

	es.objects.OrdersCollection = es.defineCollection('OrdersCollection', 'Orders');

	//#region Prototype Level Information

	es.objects.OrdersCollection.prototype.esRoutes = {
		commit: { method: 'PUT', url: 'OrdersCollection_Save', response: 'collection' },
		loadAll: { method: 'GET', url: 'OrdersCollection_LoadAll', response: 'collection' }
	};

	//#endregion

}(window.es, window.myNS));