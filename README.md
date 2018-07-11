# Square Tool for Capitalist Nut Enterprises

This tool is a combination server and web app.  It helps us to automate various aspects of our business.  It also helps us to visualize the folow of information.

## FEATURES

**1. SYNC AH-NUTS DB (FIREBASE) WITH SQUAREUP DB**
	**Transactions**
	a. Single Transactions Via Push Notifications
	b. Batch Transactions by Location and Dates

	**Employees**
	a. List of Employees

	**Locations**
	a. List of Locations

	*Cashdrawers**
	a. Single Cashdrawer
	b. Batch List of Cashdrawers

	**Items**
	a. List of Items

	**Modifiers**
	a. List of Modifers

**2. SYNC AH-NUTS DB (FIREBASE) WITH SLING.IS DB**
	**Locations**
	a. List of Locations

	**Employees**
	a. List of Employees

	**Shifts**
	a. Lost of Shifts

**3. MAINTAIN AH-NUTS DB (FIREBASE)**
	**Transaction Collection**
	a. Add Sales Day and Customer

	**Calendar Collection**
	a. Update Calendar Based on Shifts
		Frequency: Daily

	**Customers Collection**
	
	**Employees Collection**
	
	**Sales Days Collection**
	a. Update Financial Summary
		Frequency: After transactions are added to a given Sales Day
	b. Build Financial Summary
		Frquency: Upon request?

	**Reference List Collection**
	a. Update POS Devices List
	b. Update Items List
	c. Update Locations List
	d. Confirm Sales Day based on Identifying Transaction

	**Reports Collection**
	a. Build CME Performance Reports
		Frequency: Daily

	b. Build Team Member Shift Reports
		Frequency: Daily

## INSTRUCTIONS
1. **Clone the repository**

	`git clone <https://github.com/ianemcallister/CNE_sqr_tool.git>`

2. **Install the dependencies**
	
	To install the required dependencies call `npm install` from the root directory.

3. **Run the build and launch the development server**

	Serve the files via a static fileserver.  Or to build the files and launch the project call `gulp` or `gulp serve` to open up browsersync.

## DEPENDENCIES
I used the following tools for this project

* [npm](https://www.npmjs.com/package/npm) - package manager
* AngularJs - routing, MV*, event listeners, directives, factories
* Firebase - storage
* Quickbooks - integration for records
* Angularfire - to connect Angular with Firebase
* ESLint - linter
* bootstrap - for styles

## CREDITS
*All the stackoverflow info I referenced
