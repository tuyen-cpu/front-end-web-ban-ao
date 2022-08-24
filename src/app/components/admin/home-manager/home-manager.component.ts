import { Component, OnInit } from '@angular/core';

import { Bill } from 'src/app/model/bill.model';

import { BillService } from 'src/app/shared/bills.service';

@Component({
  selector: 'app-home-manager',
  templateUrl: './home-manager.component.html',
  styleUrls: ['./home-manager.component.scss'],
})
export class HomeManagerComponent implements OnInit {
  revenueData: any;
  total: any;
  bills: Bill[] = [];
  totalByMonth: any[] = [];
  countSatusBill: any[] = [];
  currentYear = new Date().getFullYear();
  statusData: any;
  totalBillData: any;
  countBillInMonth: any[] = [];
  month = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];
  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.loadBillsByYear(this.currentYear);
  }

  loadBillsByYear(year: number) {
    this.billService.getBills().subscribe((data) => {
      this.bills = data.filter((data) => {
        let time = new Date(data.createdDate);
        return year === time.getFullYear();
      });

      this.getTotalBillByMonth(this.bills);
      this.getStatusBill(this.bills);
      this.loadDataChart();
    });
  }
  loadDataChart() {
    this.revenueData = {
      labels: this.month,
      datasets: [
        {
          label: 'Doanh thu',
          backgroundColor: '#42A5F5',
          data: this.totalByMonth,
        },
      ],
    };
    this.statusData = {
      labels: [
        'Đang xử lí',
        'Chưa thanh toán',
        'Đã thanh toán',
        'Đang vận chuyển',
      ],
      datasets: [
        {
          data: this.countSatusBill,
          backgroundColor: ['#ec404d', '#ffca28', '#ab47bc', '#008dff'],
          hoverBackgroundColor: [
            '#ec404dc7',
            '#ffca2896',
            '#ab47bcbd',
            '#008dffc4',
          ],
        },
      ],
    };
    this.totalBillData = {
      labels: this.month,
      datasets: [
        {
          label: 'Tổng đơn hàng theo tháng',
          data: this.countBillInMonth,
          fill: false,
          borderColor: '#42A5F5',
          tension: 0.4,
        },
      ],
    };
  }
  update(event: Event) {
    this.totalByMonth = [];
    this.countSatusBill = [];
    this.countBillInMonth = [];
    this.loadBillsByYear(this.currentYear - 1);
  }
  updateCurrent(event: Event) {
    this.totalByMonth = [];
    this.countSatusBill = [];
    this.countBillInMonth = [];
    this.loadBillsByYear(this.currentYear);
  }

  getTotalBillByMonth(bills: Bill[]) {
    for (let i = 0; i < 12; i++) {
      let bi = bills.filter((data) => {
        let time = new Date(data.createdDate);
        return i === time.getMonth();
      });
      this.totalByMonth.push(
        bi.reduce((sum: number, item: Bill) => {
          return (sum += item.total);
        }, 0)
      );
      this.total = this.totalByMonth.reduce((sum: number, item: number) => {
        return (sum += item);
      }, 0);

      this.countBillInMonth.push(
        bi.reduce((sum: number, item: Bill) => {
          return sum + 1;
        }, 0)
      );
    }
  }
  getStatusBill(bills: Bill[]) {
    let countDangXuli = 0;
    let countChuaThanhToan = 0;
    let countDangVanChuyen = 0;
    let countDaThanhToan = 0;
    for (const bill of bills) {
      bill.status === 1
        ? countDangXuli++
        : bill.status === 2
        ? countChuaThanhToan++
        : bill.status === 3
        ? countDaThanhToan++
        : countDangVanChuyen++;
    }
    this.countSatusBill.push(
      countDangXuli,
      countChuaThanhToan,
      countDangVanChuyen,
      countDaThanhToan
    );
  }
}
