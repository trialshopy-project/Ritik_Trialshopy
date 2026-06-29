import React from 'react';
import { Link } from 'react-router-dom';
// import { Link, NavLink } from 'react-router-dom';
export default function Widget() {
    return (
        <div className="container mx-auto p-4">
           
            <div className="flex items-center space-x-8 p-4 bg-background rounded-lg shadow-md bg-">
            <span className="text-muted-foreground">Filter by:</span>
            <select className="border border-border rounded-md p-2 bg-card text-foreground">
                <option>SLA Status</option>
                <option>Option 1</option>
                <option>Option 2</option>
            </select>
            <select className="border border-border rounded-md p-2 bg-card text-foreground">
                <option>Label downloaded</option>
                <option>Option 1</option>
                <option>Option 2</option>
            </select>
            <select className="border border-border rounded-md p-2 bg-card text-foreground">
                <option>Dispatch Date</option>
                <option>Option 1</option>
                <option>Option 2</option>
            </select>
            <select className="border border-border rounded-md p-2 bg-card text-foreground">
                <option>Order Date</option>
                <option>Option 1</option>
                <option>Option 2</option>
            </select>
            <select className="border border-border rounded-md p-2 bg-card text-foreground">
                <option>SKU ID</option>
                <option>Option 1</option>
                <option>Option 2</option>
            </select>
            <input type="text" placeholder="Search..." className="border border-border rounded-md p-2 bg-card text-foreground" />
        </div>
                
                <table className="min-w-full bg-card border border-border bg-cyan-100">
                    <thead>
                        <tr className="bg-muted text-muted-foreground">
                            <th className="p-2 text-left border-r border-border">Product Details</th>
                            <th className="p-2 text-left border-r border-border">Sub-order ID</th> {/* Added border-right */}
                            <th className="p-2 text-left border-r border-border">SKU ID</th>
                            <th className="p-2 text-left border-r border-border">Meesho ID</th>
                            <th className="p-2 text-left border-r border-border">Quantity</th>
                            <th className="p-2 text-left border-r border-border">Size</th>
                            <th className="p-2 text-left border-r border-border">Dispatch Date/SLA</th>
                            <th className="p-2 text-left border-r border-border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-border bg-slate-100">
                            <td className="p-2 border-r border-border">
                                <input type="checkbox" className="mr-2" />
                                <img src="https://placehold.co/50x50" alt="tops" className="inline-block mr-2" />
                                tops<br />
                                <span className="text-muted-foreground">Order ID: 3040324212781</span>
                            </td>
                            <td className="p-2 border-r border-border">304032421278_1</td> {/* Added border-right */}
                            <td className="p-2 border-r border-border">MI-D-545</td>
                            <td className="p-2 border-r border-border">8F6C2C7G</td>
                            <td className="p-2 border-r border-border">1</td>
                            <td className="p-2 border-r border-border">S</td>
                            <td className="p-2 border-r border-border">19 Oct</td>
                            <td className="p-2 border-r border-border">
                                <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 p-1 rounded">Label</button>
                                <span className="text-orange-500">⚠️ Breaching Soon</span>
                            </td>
                        </tr>
                        <tr className="border-b border-border bg-slate-100">
                            <td className="p-2 border-r border-border">
                                <input type="checkbox" className="mr-2" />
                                <img src="https://placehold.co/50x50" alt="Saree Swarg" className="inline-block mr-2" />
                                Saree Swarg <br />
                                <span className="text-muted-foreground">Order ID: 983787595931</span>
                            </td>
                            <td className="p-2 border-r border-border">983787595931_1</td> {/* Added border-right */}
                            <td className="p-2 border-r border-border">SC-1030-Blue</td>
                            <td className="p-2 border-r border-border">2B5G3B2B</td>
                            <td className="p-2 border-r border-border">1</td>
                            <td className="p-2 border-r border-border">L</td>
                            <td className="p-2 border-r border-border">20 Oct</td>
                            <td className="p-2 border-r border-border">
                                <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 p-1 rounded">Label</button>
                                <span className="text-green-500">Downloaded</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        // </div>
    );
}
