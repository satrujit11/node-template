import mongoose from 'mongoose';
import { Downtime, DowntimeType } from './downtime.model';
import { Driver, DriverType } from '../drivers/driver.model';
import { Vehicle, VehicleType } from '../vehicles/vehicle.model';
import { RideHistory } from '../rideHistory/rideHistory.model';
import { getDriverDowntimeAggregate } from './downtime.helper';

async function testDowntimeAggregation() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/eupep-test');
    
    // Clear existing test data
    await Promise.all([
      Downtime.deleteMany({}),
      Driver.deleteMany({}),
      Vehicle.deleteMany({}),
      RideHistory.deleteMany({})
    ]);

    // Create test driver
    const driver = await Driver.create({
      name: 'Test Driver',
      mobileNumber: '1234567890',
      addressLine1: 'Test Address Line 1',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      licenseNumber: 'TEST123'
    });

    // Create test vehicles
    const vehicles = await Vehicle.create([
      {
        make: 'Tesla',
        vehicleRCNumber: 'KA01AB1234',
        VIN: 'TEST1234567890001'
      },
      {
        make: 'Tesla',
        vehicleRCNumber: 'KA01AB1235',
        VIN: 'TEST1234567890002'
      }
    ]);

    // Create test downtimes for both vehicles
    const downtimes = await Downtime.create([
      {
        vehicleId: vehicles[0]._id,
        reason: 'Maintenance',
        startTime: new Date('2024-04-06T10:00:00Z'),
        endTime: new Date('2024-04-06T14:00:00Z')
      },
      {
        vehicleId: vehicles[0]._id,
        reason: 'Battery Issue',
        startTime: new Date('2024-04-06T16:00:00Z'),
        endTime: new Date('2024-04-06T18:00:00Z')
      },
      {
        vehicleId: vehicles[1]._id,
        reason: 'Software Update',
        startTime: new Date('2024-04-06T11:00:00Z'),
        endTime: new Date('2024-04-06T13:00:00Z')
      }
    ]);

    // Create test rides for both vehicles
    await RideHistory.create([
      {
        driverId: driver._id,
        vehicleId: vehicles[0]._id,
        startTime: new Date('2024-04-06T09:00:00Z'),
        endTime: new Date('2024-04-06T12:00:00Z')
      },
      {
        driverId: driver._id,
        vehicleId: vehicles[0]._id,
        startTime: new Date('2024-04-06T15:00:00Z'),
        endTime: new Date('2024-04-06T17:00:00Z')
      },
      {
        driverId: driver._id,
        vehicleId: vehicles[1]._id,
        startTime: new Date('2024-04-06T10:00:00Z'),
        endTime: new Date('2024-04-06T14:00:00Z')
      }
    ]);

    // Test query parameters
    const query = {
      startTime: '2024-04-06T00:00:00Z',
      endTime: '2024-04-06T23:59:59Z',
      driverId: (driver._id as mongoose.Types.ObjectId).toString()
    };

    // Run the aggregation
    const pipeline = getDriverDowntimeAggregate(query);
    const results = await Downtime.aggregate(pipeline);

    console.log('Test Scenario:');
    console.log('-------------');
    console.log('Driver:', driver.name);
    
    console.log('\nVehicles:');
    vehicles.forEach(v => {
      console.log(`- ${v.make} (${v.vehicleRCNumber})`);
    });
    
    console.log('\nDowntimes:');
    downtimes.forEach((d: DowntimeType) => {
      if (d.startTime && d.endTime) {
        const vehicle = vehicles.find(v => (v._id as mongoose.Types.ObjectId).equals(d.vehicleId));
        console.log(`- ${d.reason} (${vehicle?.vehicleRCNumber}): ${d.startTime.toISOString()} to ${d.endTime.toISOString()}`);
      }
    });
    
    console.log('\nAggregation Results:');
    console.log(JSON.stringify(results, null, 2));

    // Expected intersection periods:
    // Vehicle 1:
    // 1. First downtime (10:00-14:00) intersects with first ride (09:00-12:00) = 2 hours
    // 2. Second downtime (16:00-18:00) intersects with second ride (15:00-17:00) = 1 hour
    // Vehicle 2:
    // 3. Third downtime (11:00-13:00) intersects with third ride (10:00-14:00) = 2 hours
    // Total expected downtime = 300 minutes (5 hours)

    const expectedTotalDowntime = 300; // 5 hours in minutes
    const actualTotalDowntime = results[0]?.totalDowntime;

    console.log('\nValidation:');
    console.log(`Expected total downtime: ${expectedTotalDowntime} minutes`);
    console.log(`Actual total downtime: ${actualTotalDowntime} minutes`);
    console.log(`Test ${Math.abs(expectedTotalDowntime - actualTotalDowntime) < 1 ? 'PASSED' : 'FAILED'}`);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the test
testDowntimeAggregation(); 