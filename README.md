# Square Tool for Capitalist Nut Enterprises

This tool is a combination server and web app.  It helps us to automate various aspects of our business.  It also helps us to visualize the folow of information.

## FEATURES

1. **SYNC AH-NUTS DB (FIREBASE) WITH SQUAREUP DB**

**Transactions**

a. Single Transactions Via Push Notifications
b. Batch Transactions by Location and Dates

**Employees**

a. List of Employees

**Locations**

a. List of Locations

**Cashdrawers**

a. Single Cashdrawer
b. Batch List of Cashdrawers

**Items**

a. List of Items

**Modifiers**

a. List of Modifers

2. **SYNC AH-NUTS DB (FIREBASE) WITH SLING.IS DB**
	
**Locations**

a. List of Locations

**Employees**

a. List of Employees

**Shifts**

a. Lost of Shifts

3. **MAINTAIN AH-NUTS DB (FIREBASE)**

	**Transaction Collection**

	a. Add Sales Day and Customer to a transaction

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

	e. Update Square Transactions Sync Log

	**Reports Collection**

	a. Build CME Performance Reports
		Frequency: Daily

	b. Build Team Member Shift Reports
		Frequency: Daily

**4. ENDPOINTS**

a. /api/sync/transactions

This endpoint is hit daily by a cron job.  When hit it needs to update the all transactions since the last update. It goes through the following steps:

	1. Collect The Initial Datetime & Location Parameters
		a) Download the time of the last batch update from the Ah-Nuts (Firebase) database.This datetime becomes the start datetime.  The end datetime is the current datetime.
		b) Download the list of square locations from the Ah-Nuts (Firebase) database.
	
	2. Iterate through each of the Square Locations

	3. Download the batch sales of the current location and datetimes

	4. Map all the square transactions to Ah-nuts transactions

	5. Iterate through all the transaction IDs, if they already exist in the database do nothing.  If they don't exist save each transaction individually to the databse.

	6. Check if there is a known Customer/Market/Event (CME) for teach transaction.  If there is a known CME go to a.  If the tx CME is unkown go to d.
		a) Add the Transaction ID to the designated sales day
		b) Add the Customer and Sales Day to the transaction
		c) Update the CME sums.  If the CME was known end here
		d) Add the Tx to the unassigned tx list

	7. Return to step 4 until all of the trasactions are processed

	8. Return to setp 2 until all of the locations are processed

b. /sqrwebhook

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
