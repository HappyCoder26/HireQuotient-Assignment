import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UserServiceService } from './services/user-service.service';

export interface PeriodicElement {
  id: string;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  ELEMENT_DATA: PeriodicElement[] = [];

  constructor(private dataService: UserServiceService) { }

  title = 'assignment';
  displayedColumns: string[] = ['select', 'name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.dataService.getUsers().subscribe((data) => {
      this.ELEMENT_DATA = data;
      this.dataSource.data = this.ELEMENT_DATA;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.length = this.ELEMENT_DATA.length;
  }

  selection = new SelectionModel<PeriodicElement>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  editedElement: any;

  editElement(element: any) {
    this.editedElement = element
    console.log(this.editedElement)
  }

  deleteElement(element: any) {
    const index = this.ELEMENT_DATA.indexOf(element);
    this.ELEMENT_DATA.splice(index, 1);
    this.dataSource = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);
    this.dataSource.paginator = this.paginator;
  }

  saveElement(element: any) {
    const index = this.ELEMENT_DATA.indexOf(element);
    this.ELEMENT_DATA[index] = { ...this.editedElement };
    console.log(this.editedElement)
    this.dataSource.data = [...this.ELEMENT_DATA]; // Update the MatTableDataSource
    this.editedElement = null;
  }

  cancelEdit() {
    this.editedElement = null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteSelected() {
    this.selection.selected.forEach(selectedRow => {
      const index = this.dataSource.data.indexOf(selectedRow);
      this.dataSource.data.splice(index, 1);
    });

    this.dataSource = new MatTableDataSource<PeriodicElement>(this.dataSource.data);
    this.selection.clear();
    this.dataSource.paginator = this.paginator;
  }

}
