//===============================================================================		
// EntitySpaces Version : 2012.1.0000.0
// Date Generated       : 1/15/2012 12:20:55 PM
//===============================================================================

(function (es) { //myNS = "myNameSpace" ... for example purposes

	if (typeof (es) === undefined) {
		throw "Please Load EntitySpaces.Core First";
	}

	es.objects.Suppliers = es.defineEntity(function () {

		// core columns
		this.SupplierID = ko.observable();
		this.CompanyName = ko.observable();
		this.ContactName = ko.observable();
		this.ContactTitle = ko.observable();
		this.Address = ko.observable();
		this.City = ko.observable();
		this.Region = ko.observable();
		this.PostalCode = ko.observable();
		this.Country = ko.observable();
		this.Phone = ko.observable();
		this.Fax = ko.observable();
		this.HomePage = ko.observable();

		// extended columns
		this.esExtendedData = undefined;

		// Hierarchical Properties
		this.ProductsCollectionBySupplierID = undefined;
	});

	//#region Prototype Level Information

	es.objects.Suppliers.prototype.esTypeDefs = {
		ProductsCollectionBySupplierID: "ProductsCollection"
	};
	
	es.objects.Suppliers.prototype.esRoutes = {
		commit: { method: 'PUT', url: 'Suppliers_Save', response: 'entity' },
		loadByPrimaryKey: { method: 'GET', url: 'Suppliers_LoadByPrimaryKey', response: 'entity' }
	};

	es.objects.Suppliers.prototype.esColumnMap = {
		'SupplierID': 1,
		'CompanyName': 1,
		'ContactName': 1,
		'ContactTitle': 1,
		'Address': 1,
		'City': 1,
		'Region': 1,
		'PostalCode': 1,
		'Country': 1,
		'Phone': 1,
		'Fax': 1,
		'HomePage': 1
	};

	//#endregion

}(window.es, window.myNS));

(function (es) {

	es.objects.SuppliersCollection = es.defineCollection('SuppliersCollection', 'Suppliers');

	//#region Prototype Level Information

	es.objects.SuppliersCollection.prototype.esRoutes = {
		commit: { method: 'PUT', url: 'SuppliersCollection_Save', response: 'collection' },
		loadAll: { method: 'GET', url: 'SuppliersCollection_LoadAll', response: 'collection' }
	};

	//#endregion

}(window.es, window.myNS));
