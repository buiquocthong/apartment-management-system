package vn.apartment.master.interactor.renter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.renter.RenterDTO;
import vn.apartment.master.dto.renter.RenterPageDTO;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.mapper.RenterMapper;
import vn.apartment.master.service.RenterService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListRenter {
    @Autowired
    private RenterService renterService;
    @Autowired
    private RenterMapper renterMapper;

    @Transactional(readOnly = true)
    public RenterPageDTO execute(ApiQuery apiQuery) {
        Page<Renter> pageResults = renterService.findMatchingRenters(apiQuery);
        List<RenterDTO> dtos = pageResults.get().map(renterMapper::toDTO).collect(Collectors.toList());
        return new RenterPageDTO(pageResults.getTotalElements(), dtos);
    }
}
